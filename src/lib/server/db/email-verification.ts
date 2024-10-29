import type { RequestEvent } from '@sveltejs/kit';
import { prisma } from '.';
import { generateRandomOTP } from '../auth/utils';
import { deleteEmailVerificationRequestCookie } from '../auth';

export async function deleteUserEmailVerificationRequest(userId: string) {
	await prisma.emailVerificationRequest.deleteMany({ where: { userId } });
}

export async function createEmailVerificationRequest(userId: string, email: string) {
	// Delete old requests
	await deleteUserEmailVerificationRequest(userId);

	const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes
	const code = generateRandomOTP();

	return await prisma.emailVerificationRequest.create({
		data: {
			userId,
			email,
			code,
			expiresAt
		}
	});
}

export async function getUserEmailVerificationRequestFromRequest(event: RequestEvent) {
	if (event.locals.auth.user === null) {
		return null;
	}
	const id = event.cookies.get('email_verification') ?? null;
	if (id === null) {
		return null;
	}
	const request = await prisma.emailVerificationRequest.findUnique({ where: { id } });
	if (request === null) {
		deleteEmailVerificationRequestCookie(event);
	}
	return request;
}

export async function updateUserEmailAndSetEmailAsVerified(userId: string, email: string) {
	await prisma.user.update({ where: { id: userId }, data: { email, emailVerified: true } });
}
