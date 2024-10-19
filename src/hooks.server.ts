import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from '@/server/auth';
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

const guestRoutes = ['/', '/sign-in', '/sign-up'];
const authedUserRoutes = ['/sign-out', '/dashboard'];

const protectRoutesHandle: Handle = async ({ event, resolve }) => {
	// Handle authed user routes
	if (event.locals.user && event.locals.session && guestRoutes.includes(event.url.pathname)) {
		redirect(302, '/dashboard');
	}

	// Handle guest routes
	if (
		!event.locals.user &&
		!event.locals.session &&
		authedUserRoutes.includes(event.url.pathname)
	) {
		redirect(302, '/');
	}

	return resolve(event);
};

export const handle = sequence(authHandle, protectRoutesHandle);
