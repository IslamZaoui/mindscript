import { updateUserImageSchema, updateUserInfoSchema } from '@/schemas';
import { prisma } from '@/server/db';
import { checkUsernameAvailability } from '@/server/db/user.js';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { user, isAuthenticated } = event.locals.auth;
	if (!isAuthenticated) redirect(302, '/sign-in');
	if (!user.emailVerified) redirect(302, '/verify-email');

	return {
		updateUserInfoForm: await superValidate(event, zod(updateUserInfoSchema), {
			defaults: {
				username: user.username,
				location: user.location ?? undefined,
				bio: user.bio ?? undefined,
				website: user.website ?? undefined
			}
		}),
		updateUserImageForm: await superValidate(event, zod(updateUserImageSchema), {
			defaults: {
				image: user.image ?? undefined
			}
		}),
		user
	};
};

export const actions = {
	updateUserImage: async (event) => {
		const { user, isAuthenticated } = event.locals.auth;
		const form = await superValidate(event, zod(updateUserImageSchema));

		if (!isAuthenticated) redirect('/sign-in', { type: 'error', message: 'Unauthorized' }, event);

		if (!user.emailVerified)
			redirect('/verify-email', { type: 'error', message: 'Email not verified' }, event);

		await prisma.user.update({
			where: { id: user.id },
			data: form.data
		});

		redirect({ type: 'success', message: 'Image has been updated' }, event);
	},
	updateUserInfo: async (event) => {
		const { user, isAuthenticated } = event.locals.auth;
		const form = await superValidate(event, zod(updateUserInfoSchema));

		if (!isAuthenticated) redirect('/sign-in', { type: 'error', message: 'Unauthorized' }, event);

		if (!user.emailVerified)
			redirect('/verify-email', { type: 'error', message: 'Email not verified' }, event);

		if (!form.valid) return fail(400, { form });

		if (
			user.username !== form.data.username &&
			(await checkUsernameAvailability(form.data.username)) === false
		) {
			setError(form, 'username', 'Username already taken');
			return fail(400, { form });
		}

		await prisma.user.update({
			where: { id: user.id },
			data: form.data
		});

		redirect({ type: 'success', message: 'Your information has been updated' }, event);
	}
};
