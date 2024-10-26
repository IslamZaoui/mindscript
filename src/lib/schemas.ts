import { z } from 'zod';
import zxcvbn from 'zxcvbn';

const passwordSchema = z
	.string({ required_error: 'Password is required' })
	.min(8, { message: 'Password must be at least 8 characters' })
	.max(40, { message: 'Password must be at most 40 characters' })
	.refine((password) => zxcvbn(password).score >= 3, {
		message: 'Password is too weak'
	});

const usernameSchema = z
	.string({ required_error: 'Username is required' })
	.min(5, { message: 'Username must be at least 5 characters' })
	.max(16, { message: 'Username must be at most 16 characters' })
	.regex(/^[a-zA-Z0-9._]+$/, {
		message: 'Username can only contain letters numbers, dots, and underscores'
	})
	.trim();

const emailSchema = z
	.string({ required_error: 'Email is required' })
	.email({ message: 'Must be a valid email' })
	.trim();

const codeSchema = z
	.string({ required_error: 'Code is required' })
	.length(8, { message: 'Code must be 8 characters' })
	.trim();

export const signUpSchema = z
	.object({
		username: usernameSchema,
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: passwordSchema,
		tos: z.boolean().refine((val) => val, { message: 'You must accept the terms and conditions' })
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match',
				path: ['confirmPassword']
			});
		}
	});

export const signInUsernameSchema = z.object({
	username: usernameSchema,
	password: passwordSchema,
	rememberMe: z.boolean().default(false)
});

export const emailVerificationCodeSchema = z.object({
	code: codeSchema
});

export const forgotPasswordSchema = z.object({
	email: emailSchema
});

export const resetPasswordSchema = z
	.object({
		code: codeSchema,
		password: passwordSchema,
		confirmPassword: passwordSchema
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match',
				path: ['confirmPassword']
			});
		}
	});

export const updateUserImageSchema = z.object({
	image: z.union([z.string().url({ message: 'Must be a valid URL' }), z.string().max(0)]).optional()
});

export const updateUserInfoSchema = z.object({
	username: usernameSchema,
	bio: z.string().max(50, { message: 'Bio must be at most 50 characters' }).optional(),
	location: z.string().max(50, { message: 'Location must be at most 50 characters' }).optional(),
	website: z
		.union([z.string().url({ message: 'Must be a valid URL' }), z.string().max(0)])
		.optional()
});
