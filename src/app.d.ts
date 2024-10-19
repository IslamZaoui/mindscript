import type { Session, User } from '@/server/auth';

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
			user: User | null;
			session: Session | null;
		}
	}
}

export {};
