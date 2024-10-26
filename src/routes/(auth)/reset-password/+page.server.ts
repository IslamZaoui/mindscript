import { resetPasswordSchema } from '@/schemas';
import {
	createSession,
	deletePasswordResetSessionTokenCookie,
	generateSessionToken,
	setSessionTokenCookie,
	validatePasswordResetSessionRequest
} from '@/server/auth';
import { hashPassword } from '@/server/auth/password';
import { invalidateUserPasswordResetSessions } from '@/server/db/password-reset';
import { invalidateUserSessions, updateUserPassword } from '@/server/db/user';
import { formatTime } from '@/utils/format';
import { redirect } from 'sveltekit-flash-message/server';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';
import { fail, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const limiter = new RetryAfterRateLimiter({
	IP: [10, '15m'],
	IPUA: [6, 'm']
});

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
		const status = await limiter.check(event);
		if (status.limited) {
			const time = formatTime(status.retryAfter);
			redirect(
				{
					type: 'error',
					message: `Too many requests.`,
					description: `Please try again after ${time}.`
				},
				event
			);
		}

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

		redirect(
			`/${user.username}`,
			{ type: 'success', message: 'Password reset successfully' },
			event
		);
	}
};
