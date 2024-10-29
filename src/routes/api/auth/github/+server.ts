import { generateState } from 'arctic';
import { github } from '@/server/auth/oauth';
import { type RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export async function GET(event: RequestEvent): Promise<Response> {
	if (event.locals.auth.isAuthenticated)
		redirect('/', { type: 'error', message: 'Already authenticated' }, event);

	const state = generateState();
	const url = github.createAuthorizationURL(state, ['user:email']);

	event.cookies.set('github_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url);
}
