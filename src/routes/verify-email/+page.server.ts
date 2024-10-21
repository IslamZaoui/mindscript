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
import { error } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	if (event.locals.session === null || event.locals.user === null) {
		return error(401, 'Unauthorized');
	}

	let verificationRequest = await getUserEmailVerificationRequestFromRequest(event);
	if (verificationRequest === null || Date.now() >= verificationRequest.expiresAt.getTime()) {
		verificationRequest = await createEmailVerificationRequest(
			event.locals.user.id,
			event.locals.user.email
		);
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
		if (event.locals.session === null || event.locals.user === null) {
			return error(401, 'Unauthorized');
		}

		const verificationRequest = await createEmailVerificationRequest(
			event.locals.user.id,
			event.locals.user.email
		);
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
		if (event.locals.session === null || event.locals.user === null) {
			return error(401, 'Unauthorized');
		}

		const form = await superValidate(event, zod(emailVerificationCodeSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		let verificationRequest = await getUserEmailVerificationRequestFromRequest(event);

		if (verificationRequest === null) {
			return fail(400, { message: 'Unauthorized' });
		}

		if (Date.now() >= verificationRequest.expiresAt.getTime()) {
			verificationRequest = await createEmailVerificationRequest(
				verificationRequest.userId,
				verificationRequest.email
			);
			sendVerificationEmail(verificationRequest.email, verificationRequest.code);
			return fail(400, {
				message: 'Verification code expired. Please request a new code.'
			});
		}
		if (verificationRequest.code !== form.data.code) {
			return fail(400, {
				message: 'Invalid verification code'
			});
		}
		await deleteUserEmailVerificationRequest(event.locals.user.id);
		await invalidateUserPasswordResetSessions(event.locals.user.id);
		await updateUserEmailAndSetEmailAsVerified(event.locals.user.id, verificationRequest.email);
		deleteEmailVerificationRequestCookie(event);

		redirect(
			'/dashboard',
			{
				type: 'success',
				message: 'Email verified',
				description: `welcome ${event.locals.user.username}.`
			},
			event
		);
	}
};
