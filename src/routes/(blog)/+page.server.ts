import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async (event) => {
		const { email } = Object.fromEntries(await event.request.formData());

		event.cookies.set('sign-up-email', email.toString(), {
			httpOnly: true,
			path: '/',
			expires: new Date(Date.now() + 1000 * 60 * 1), // 1 min
			sameSite: 'lax',
			secure: !dev
		});

		redirect(302, '/sign-up');
	}
};
