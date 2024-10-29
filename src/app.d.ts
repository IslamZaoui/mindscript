import type { Session, User } from '@/server/auth';

type Authed = { user: User; session: Session; isAuthenticated: true };
type UnAuthed = { user: null; session: null; isAuthenticated: false };

declare global {
	type Flash = {
		type: 'success' | 'error' | 'info' | 'warning';
		message: string;
		description?: string;
	};
	namespace App {
		interface PageData {
			flash?: Flash;
		}
		interface Locals {
			auth: Authed | UnAuthed;
		}
	}
}

export {};
