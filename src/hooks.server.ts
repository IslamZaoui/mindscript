import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from '@/server/auth';
import { isInGuestRoutes, isInProtectedRoutes } from '@/server/routes';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authHandle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.session = session;
	event.locals.user = user;
	return resolve(event);
};

const protectRoutesHandle: Handle = async ({ event, resolve }) => {
	const {
		locals: { user }
	} = event;

	if (event.url.pathname.startsWith('/api')) {
		return resolve(event);
	}

	if (!user && !isInGuestRoutes(event)) {
		redirect(307, '/sign-in');
	}

	if (isInGuestRoutes(event)) {
		if (user?.emailVerified) {
			redirect(307, '/dashboard');
		} else {
			redirect(307, '/verify-email');
		}
	}

	if (isInProtectedRoutes(event) && !user?.emailVerified) {
		redirect(307, '/verify-email');
	}

	if (event.url.pathname === '/verify-email' && user?.emailVerified) {
		redirect(307, '/dashboard');
	}

	return resolve(event);
};

export const handle = sequence(authHandle, protectRoutesHandle);
