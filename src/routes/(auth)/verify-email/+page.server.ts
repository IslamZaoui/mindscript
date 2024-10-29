import { emailVerificationCodeSchema } from '@/schemas';
import {
	deleteEmailVerificationRequestCookie,
	setEmailVerificationRequestCookie
} from '@/server/auth';
import {
	createEmailVerificationRequest,
	deleteUserEmailVerificationRequest,
	getUserEmailVerificationRequestFromRequest,
	updateUserEmailAndSetEmailAsVerified
} from '@/server/db/email-verification';
import { invalidateUserPasswordResetSessions } from '@/server/db/password-reset';
import { sendVerificationEmail } from '@/server/mail';
import { formatTime } from '@/utils/format';
import { error } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const validateLimiter = new RetryAfterRateLimiter({
	IP: [5, '15m'],
	IPUA: [3, 'm']
});

const resendLimiter = new RetryAfterRateLimiter({
	IP: [3, 'h'],
	IPUA: [1, 'm']
});

export const load = async (event) => {
	const { isAuthenticated, user } = event.locals.auth;
	if (!isAuthenticated) redirect(302, '/sign-in');

	if (user.emailVerified)
		redirect(302, '/');

	let verificationRequest = await getUserEmailVerificationRequestFromRequest(event);
	if (verificationRequest === null || Date.now() >= verificationRequest.expiresAt.getTime()) {
		verificationRequest = await createEmailVerificationRequest(user.id, user.email);
		await sendVerificationEmail(verificationRequest.email, verificationRequest.code);
		setEmailVerificationRequestCookie(event, verificationRequest);
	}
	return {
		email: verificationRequest.email,
		expiresAt: verificationRequest.expiresAt,
		form: await superValidate(event, zod(emailVerificationCodeSchema))
	};
};

export const actions = {
	resend: async (event) => {
		const { isAuthenticated, user } = event.locals.auth;

		const status = await resendLimiter.check(event);
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

		if (!isAuthenticated) {
			return error(401, 'Unauthorized');
		}

		const verificationRequest = await createEmailVerificationRequest(user.id, user.email);
		await sendVerificationEmail(verificationRequest.email, verificationRequest.code);
		setEmailVerificationRequestCookie(event, verificationRequest);

		redirect(
			{
				type: 'success',
				message: 'Verification email sent'
			},
			event
		);
	},

	verifyEmail: async (event) => {
		const { isAuthenticated, user } = event.locals.auth;

		const status = await validateLimiter.check(event);
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

		if (!isAuthenticated) {
			redirect('/', { type: 'error', message: 'Unauthorized' }, event);
		}

		const form = await superValidate(event, zod(emailVerificationCodeSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		let verificationRequest = await getUserEmailVerificationRequestFromRequest(event);

		if (verificationRequest === null) {
			redirect('/dahsboard', { type: 'error', message: 'Unauthorized' }, event);
		}

		if (Date.now() >= verificationRequest.expiresAt.getTime()) {
			verificationRequest = await createEmailVerificationRequest(
				verificationRequest.userId,
				verificationRequest.email
			);
			sendVerificationEmail(verificationRequest.email, verificationRequest.code);
			redirect(
				{ type: 'info', message: 'Verification code expired. Please request a new code.' },
				event
			);
		}
		if (verificationRequest.code !== form.data.code) {
			redirect(
				{
					type: 'error',
					message: 'Invalid verification code'
				},
				event
			);
		}
		await deleteUserEmailVerificationRequest(user.id);
		await invalidateUserPasswordResetSessions(user.id);
		await updateUserEmailAndSetEmailAsVerified(user.id, verificationRequest.email);
		deleteEmailVerificationRequestCookie(event);

		redirect(
			`/${user.username}`,
			{
				type: 'success',
				message: 'Email verified',
				description: `welcome ${user.username}.`
			},
			event
		);
	}
};
