import { signInUsernameSchema } from '@/schemas';
import { generateSessionToken, createSession, setSessionTokenCookie } from '@/server/auth';
import { verifyPasswordHash } from '@/server/auth/password';
import { prisma } from '@/server/db';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	return {
		form: await superValidate(zod(signInUsernameSchema))
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signInUsernameSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const user = await prisma.user.findUnique({
			where: { username: form.data.username }
		});

		if (!user || !user.hashedPassword) {
			setError(form, 'username', 'Invalid username or password');
			return fail(400, { form });
		}

		const validPassword = await verifyPasswordHash(user.hashedPassword, form.data.password);

		if (!validPassword) {
			setError(form, 'username', 'Invalid username or password');
			return fail(400, { form });
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id, form.data.rememberMe);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		redirect(
			'/dashboard',
			{
				type: 'success',
				message: 'Sign in successful',
				description: `Welcome back ${user.username}.`
			},
			event
		);
	}
};