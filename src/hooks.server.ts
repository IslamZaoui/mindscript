import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from '@/server/auth';
import { type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		event.locals.auth = {
			session: null,
			user: null,
			isAuthenticated: false
		};
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.auth =
		user !== null && session !== null
			? {
					user,
					session,
					isAuthenticated: true
				}
			: {
					user: null,
					session: null,
					isAuthenticated: false
				};

	return resolve(event);
};
