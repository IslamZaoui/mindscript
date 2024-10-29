import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { isAuthenticated, user } = event.locals.auth;
	if (isAuthenticated) redirect(302, `/${user.username}`);

	return {};
};

export const actions = {
	default: async (event) => {
		const { email } = Object.fromEntries(await event.request.formData());

		event.cookies.set('sign-up-email', email.toString(), {
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			secure: !dev
		});

		redirect(302, '/sign-up');
	}
};
