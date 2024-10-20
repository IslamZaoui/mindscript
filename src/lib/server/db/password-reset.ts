import { encodeHexLowerCase } from '@oslojs/encoding';
import { prisma } from '.';
import { sha256 } from '@oslojs/crypto/sha2';
import { generateRandomOTP } from '../auth/utils';

export async function invalidateUserPasswordResetSessions(userId: string) {
	await prisma.passwordResetSession.deleteMany({ where: { userId } });
}

export const createPasswordResetSession = async (token: string, userId: string, email: string) => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes
	const code = generateRandomOTP();

	return await prisma.passwordResetSession.create({
		data: {
			id: sessionId,
			userId,
			email,
			code,
			expiresAt
		}
	});
};

export const validatePasswordResetSessionToken = async (token: string) => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await prisma.passwordResetSession.findUnique({
		where: { id: sessionId },
		include: {
			user: {
				select: {
					id: true,
					email: true,
					emailVerified: true,
					username: true
				}
			}
		}
	});

	if (result === null) {
		return { session: null, user: null };
	}

	const { user, ...session } = result;

	if (Date.now() >= session.expiresAt.getTime()) {
		await prisma.passwordResetSession.delete({ where: { id: sessionId } });
		return { session: null, user: null };
	}

	return { session, user };
};
