import type { RequestEvent } from '@sveltejs/kit';

export function isInGuestRoutes(event: RequestEvent): boolean {
	const {
		url: { pathname }
	} = event;

	if (pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up') return true;

	return false;
}

export function isInProtectedRoutes(event: RequestEvent): boolean {
	const {
		url: { pathname }
	} = event;
	if (pathname === '/dashboard') return true;
	return false;
}