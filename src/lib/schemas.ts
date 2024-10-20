import { z } from 'zod';
import zxcvbn from 'zxcvbn';

const passwordSchema = z
	.string({ required_error: 'Password is required' })
	.min(8, { message: 'Password must be at least 8 characters' })
	.max(64, { message: 'Password must be at most 64 characters' })
	.refine((password) => zxcvbn(password).score >= 2, {
		message: 'Password is too weak'
	});

const usernameSchema = z
	.string({ required_error: 'Username is required' })
	.min(5, { message: 'Username must be at least 5 characters' })
	.max(16, { message: 'Username must be at most 16 characters' })
	.regex(/^[a-zA-Z0-9]+$/, { message: 'Username can only contain letters and numbers' })
	.trim();

const emailSchema = z
	.string({ required_error: 'Email is required' })
	.email({ message: 'Must be a valid email' })
	.trim();

const codeSchema = z
	.string({ required_error: 'Code is required' })
	.min(8, { message: 'Code must be at least 6 characters' })
	.max(8, { message: 'Code must be at most 6 characters' })
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
