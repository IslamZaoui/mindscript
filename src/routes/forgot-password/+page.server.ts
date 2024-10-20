import { forgotPasswordSchema } from '@/schemas';
import { generateSessionToken, setPasswordResetSessionTokenCookie } from '@/server/auth/index.js';
import {
	createPasswordResetSession,
	invalidateUserPasswordResetSessions
} from '@/server/db/password-reset';
import { getUserFromEmail } from '@/server/db/user';
import { sendPasswordResetEmail } from '@/server/mail';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	return {
		form: await superValidate(zod(forgotPasswordSchema))
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(forgotPasswordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const user = await getUserFromEmail(form.data.email);
		if (!user) {
			setError(form, 'email', 'User not found');
			return fail(400, { form });
		}

		invalidateUserPasswordResetSessions(user.id);
		const sessionToken = generateSessionToken();
		const session = await createPasswordResetSession(sessionToken, user.id, user.email);
		await sendPasswordResetEmail(session.email, session.code);
		setPasswordResetSessionTokenCookie(event, sessionToken, session.expiresAt);

		redirect('/reset-password', { type: 'success', message: 'Password reset email sent' }, event);
	}
};
