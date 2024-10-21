import type { Prisma, User } from '@prisma/client';
import { prisma } from '.';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
	const user = await prisma.user.findUnique({ where: { username } });
	return user === null;
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
	const user = await prisma.user.findUnique({ where: { email } });
	return user === null;
}

type UserCreateBody = Prisma.Args<typeof prisma.user, 'create'>['data'];
export async function createUser(data: Omit<UserCreateBody, 'id' | 'sessions'>): Promise<User> {
	return await prisma.user.create({ data });
}

export async function getUserFromEmail(email: string) {
	return await prisma.user.findUnique({ where: { email } });
}

export const invalidateUserSessions = async (userId: string) => {
	await prisma.session.deleteMany({ where: { userId } });
};

export const updateUserPassword = async (userId: string, hashedPassword: string) => {
	await prisma.user.update({ where: { id: userId }, data: { hashedPassword } });
};

export const getUserFromGitHubId = async (githubId: number) => {
	return await prisma.user.findFirst({ where: { githubId } });
};
