import { signUpSchema } from '@/schemas';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { checkUsernameAvailability, createUser } from '@/server/db/user.js';
import { hashPassword } from '@/server/auth/password.js';
import {
	createSession,
	generateSessionToken,
	setEmailVerificationRequestCookie,
	setSessionTokenCookie
} from '@/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
import { createEmailVerificationRequest } from '@/server/db/email-verification';
import { sendVerificationEmail } from '@/server/mail';

export const load = async () => {
	return {
		form: await superValidate(zod(signUpSchema))
	};
};

export const actions = {
	default: async (event) => {
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
