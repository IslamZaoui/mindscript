import { RESEND_API_KEY } from '$env/static/private';
import { emailVerificationTemplate, resetPasswordTemplate } from './templates';

const siteEmail = 'mindscript@islamzaoui.top';

interface MailData {
	to: string[];
	from: string;
	subject: string;
	html: string;
}

async function sendEmail(data: MailData): Promise<void> {
	await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${RESEND_API_KEY}`
		},
		body: JSON.stringify(data)
	});
}

export async function sendVerificationEmail(email: string, code: string) {
	const html = emailVerificationTemplate(code);
	await sendEmail({
		to: [email],
		from: siteEmail,
		subject: 'Verify your email address',
		html
	});
}

export async function sendPasswordResetEmail(email: string, code: string) {
	const html = resetPasswordTemplate(code);
	await sendEmail({
		to: [email],
		from: siteEmail,
		subject: 'Reset your password',
		html
	});
}
