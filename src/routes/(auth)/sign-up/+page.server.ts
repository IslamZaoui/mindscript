import { signUpSchema } from '@/schemas';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { checkUsernameAvailability, createUser } from '@/server/db/user';
import { hashPassword } from '@/server/auth/password';
import {
	createSession,
	generateSessionToken,
	setEmailVerificationRequestCookie,
	setSessionTokenCookie
} from '@/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
import { createEmailVerificationRequest } from '@/server/db/email-verification';
import { sendVerificationEmail } from '@/server/mail';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';
import { formatTime } from '@/utils/format';

const limiter = new RetryAfterRateLimiter({
	IP: [5, '15m'],
	IPUA: [3, 'm']
});

export const load = async (event) => {
	return {
		form: await superValidate(zod(signUpSchema)),
		email: event.cookies.get('sign-up-email')
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

		const form = await superValidate(event, zod(signUpSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!(await checkUsernameAvailability(form.data.username))) {
			setError(form, 'username', 'Username already taken');
			return fail(400, { form });
		}

		if (!(await checkUsernameAvailability(form.data.email))) {
			setError(form, 'email', 'Email already taken');
			return fail(400, { form });
		}

		const hashedPassword = await hashPassword(form.data.password);
		const user = await createUser({
			username: form.data.username,
			email: form.data.email,
			hashedPassword
		});

		const emailVerificationRequest = await createEmailVerificationRequest(user.id, user.email);
		await sendVerificationEmail(emailVerificationRequest.email, emailVerificationRequest.code);
		setEmailVerificationRequestCookie(event, emailVerificationRequest);

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		redirect(
			'/verify-email',
			{
				type: 'success',
				message: 'Sign up successful',
				description: `Check your email to verify your account.`
			},
			event
		);
	}
};
