import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.locals.user && !event.locals.session) {
		redirect(302, '/sign-in');
	}

	return {};
};
