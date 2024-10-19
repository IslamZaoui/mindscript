import { prisma } from '../db';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import type { User, Session, EmailVerificationRequest } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { dev } from '$app/environment';

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(
	token: string,
	userId: string,
	rememberME: boolean = true
): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const expiresAt = rememberME
		? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
		: new Date(Date.now() + 1000 * 60 * 60 * 24);
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt
	};
	await prisma.session.create({
		data: session
	});
	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await prisma.session.findUnique({
		where: {
			id: sessionId
		},
		include: {
			user: {
				select: {
					id: true,
					email: true,
					emailVerified: true,
					username: true
				}
			}
		}
	});
	if (result === null) {
		return { session: null, user: null };
	}
	const { user, ...session } = result;
	if (Date.now() >= session.expiresAt.getTime()) {
		await prisma.session.delete({ where: { id: sessionId } });
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await prisma.session.update({
			where: {
				id: session.id
			},
			data: {
				expiresAt: session.expiresAt
			}
		});
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await prisma.session.delete({ where: { id: sessionId } });
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('session', '', {
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}

export function setEmailVerificationRequestCookie(
	event: RequestEvent,
	request: EmailVerificationRequest
): void {
	event.cookies.set('email_verification', request.id, {
		httpOnly: true,
		path: '/',
		secure: !dev,
		sameSite: 'lax',
		expires: request.expiresAt
	});
}

export function deleteEmailVerificationRequestCookie(event: RequestEvent): void {
	event.cookies.set('email_verification', '', {
		httpOnly: true,
		path: '/',
		secure: !dev,
		sameSite: 'lax',
		maxAge: 0
	});
}

type UserWithoutPassword = Omit<User, 'hashedPassword'>;

export type { Session, UserWithoutPassword as User };

export type SessionValidationResult =
	| { session: Session; user: UserWithoutPassword }
	| { session: null; user: null };
