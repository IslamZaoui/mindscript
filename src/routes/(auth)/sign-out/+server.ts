import { invalidateSession } from '@/server/auth';
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	if (event.locals.user && event.locals.session) {
		await invalidateSession(event.locals.session.id);
	}
	redirect(302, '/');
};
