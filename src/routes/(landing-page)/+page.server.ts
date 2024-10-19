import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { authData } = await parent();

	if (authData) {
		redirect(302, '/dashboard');
	}

	return {};
};
