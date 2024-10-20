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

const protectRoutesHandle: Handle = async ({ event, resolve }) => {
	const { user, session } = event.locals;

	const protectedRoutes = ['/dashboard'];
	const publicRoutes = ['/', '/sign-in', '/sign-up', '/forgot-password'];
	const emailVerificationRoute = '/verify-email';

	const isAuthenticated = user && session;
	const isEmailVerified = user?.emailVerified;

	const currentPath = event.url.pathname;

	if (protectedRoutes.includes(currentPath)) {
		if (!isAuthenticated) {
			throw redirect(302, '/sign-in');
		}

		if (!isEmailVerified) {
			throw redirect(302, '/verify-email');
		}
	}

	if (currentPath === emailVerificationRoute) {
		if (!isAuthenticated) {
			throw redirect(302, '/sign-in');
		}

		if (isEmailVerified) {
			throw redirect(302, '/dashboard');
		}
	}

	if (publicRoutes.includes(currentPath) && isAuthenticated) {
		throw redirect(302, '/dashboard');
	}

	return resolve(event);
};

export const handle = sequence(authHandle, protectRoutesHandle);
