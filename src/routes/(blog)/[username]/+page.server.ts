import { prisma } from '@/server/db';
import { error } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	const { user, isAuthenticated } = event.locals.auth;

	if (isAuthenticated && !user.emailVerified)
		redirect('/verify-email', { type: 'error', message: 'Email not verified' }, event);

	const { username } = event.params;
	const userProfile = await prisma.user.findUnique({
		where: { username },
		omit: {
			hashedPassword: true
		}
	});

	if (!userProfile) return error(404, 'User not found');

	const page = Number(event.url.searchParams.get('page')) || 1;

	const getUserPosts = async (page: number) => {
		return await prisma.post.findMany({
			where: {
				userId: userProfile.id,
				published: true
			},
			omit: {
				content: true,
				published: true
			},
			include: {
				Analytics: {
					select: {
						views: true,
						likes: true,
						shares: true
					}
				}
			},
			take: 5,
			skip: 5 * (page - 1),
			orderBy: {
				createdAt: 'desc'
			}
		});
	};

	return {
		userProfile,
		getUserPosts: getUserPosts(page)
	};
};
