import { invalidateSession } from '@/server/auth';
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	if (event.locals.auth.isAuthenticated) {
		await invalidateSession(event.locals.auth.session.id);
	}
	redirect(302, '/');
};
