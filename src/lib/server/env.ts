import z from 'zod';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const EnvSchema = z.object({
	private: z.object({
		DATABASE_URL: z
			.string({ required_error: 'DATABASE_URL is required' })
			.startsWith('postgresql://', 'DATABASE_URL must be a valid PostgreSQL connection string'),
		RESEND_API_KEY: z
			.string({ required_error: 'RESEND_API_KEY is required' })
			.startsWith('re_', "RESEND_API_KEY must be in the format 're_...'"),
		GITHUB_CLIENT_ID: z
			.string({ required_error: 'GITHUB_CLIENT_ID is required' })
			.length(20, 'GITHUB_CLIENT_ID must be 20 characters long'),
		GITHUB_CLIENT_SECRET: z
			.string({ required_error: 'GITHUB_CLIENT_SECRET is required' })
			.length(40, 'GITHUB_CLIENT_SECRET must be 40 characters long')
	}),
	public: z.object({
		PUBLIC_BASE_URL: z
			.string({ required_error: 'PUBLIC_BASE_URL is required' })
			.url({ message: 'PUBLIC_BASE_URL must be a valid URL' })
	})
});

export const validateEnv = async () => {
	const result = await EnvSchema.safeParseAsync({
		private: {
			DATABASE_URL: privateEnv.DATABASE_URL,
			RESEND_API_KEY: privateEnv.RESEND_API_KEY,
			GITHUB_CLIENT_ID: privateEnv.GITHUB_CLIENT_ID,
			GITHUB_CLIENT_SECRET: privateEnv.GITHUB_CLIENT_SECRET
		},

		public: {
			PUBLIC_BASE_URL: publicEnv.PUBLIC_BASE_URL
		}
	});

	if (!result.success) {
		const issues = result.error.issues.map((error) => error.message);
		throw new Error(`Invalid environment variables:\n${issues.join('\n')}`);
	}
};
