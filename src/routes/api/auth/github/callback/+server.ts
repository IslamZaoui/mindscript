import { generateSessionToken, createSession, setSessionTokenCookie } from '@/server/auth';
import { github } from '@/server/auth/oauth';
import { createUser, getUserFromGitHubId } from '@/server/db/user';
import { type RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { redirect } from 'sveltekit-flash-message/server';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;

	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}

	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch {
		redirect('/', { type: 'error', message: 'Invalid code' }, event);
	}

	const githubUserResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});

	const githubEmailResponse = await fetch('https://api.github.com/user/emails', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});

	interface GitHubUser {
		id: number;
		login: string;
	}
	interface GitHubEmail {
		email: string;
		primary: boolean;
	}

	const githubUser: GitHubUser = await githubUserResponse.json();
	const githubUserEmail: GitHubEmail[] = await githubEmailResponse.json();
	const githubUserId: number = githubUser.id;
	const githubUsername: string = githubUser.login;
	const githubEmail: string = githubUserEmail.find((email) => email.primary === true)!.email;

	const existingUser = await getUserFromGitHubId(githubUserId);

	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		redirect(302, `/${existingUser.username}`);
	}

	const user = await createUser({
		username: githubUsername,
		email: githubEmail,
		githubId: githubUserId,
		emailVerified: true
	});

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	redirect(
		`/${user.username}`,
		{ type: 'success', message: 'Signed up successfully', description: 'welcome to MindScript' },
		event
	);
}
