import { resetPasswordSchema } from '@/schemas';
import {
	createSession,
	deletePasswordResetSessionTokenCookie,
	generateSessionToken,
	setSessionTokenCookie,
	validatePasswordResetSessionRequest
} from '@/server/auth';
import { hashPassword } from '@/server/auth/password';
import { invalidateUserPasswordResetSessions } from '@/server/db/password-reset.js';
import { invalidateUserSessions, updateUserPassword } from '@/server/db/user';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await validatePasswordResetSessionRequest(event);
	if (session === null) {
		redirect(302, '/forgot-password');
	}
	return {
		form: await superValidate(zod(resetPasswordSchema))
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(resetPasswordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { session: passwordResetSession, user } =
			await validatePasswordResetSessionRequest(event);

		if (!passwordResetSession) {
			setMessage(form, 'Invalid session');
			return fail(401, { form });
		}

		const hashedPassword = await hashPassword(form.data.password);

		invalidateUserPasswordResetSessions(passwordResetSession.userId);
		await invalidateUserSessions(passwordResetSession.userId);
		await updateUserPassword(passwordResetSession.userId, hashedPassword);

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		deletePasswordResetSessionTokenCookie(event);

		redirect('/dashboard', { type: 'success', message: 'Password reset successfully' }, event);
	}
};
