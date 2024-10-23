import emailVerificationHTML from './email-verification.html?raw';
import forgotPasswordHTML from './forgot-password.html?raw';

export const emailVerificationTemplate = (code: string) => {
	return emailVerificationHTML.replace('{{ code }}', code);
};

export const resetPasswordTemplate = (code: string) => {
	return forgotPasswordHTML.replace('{{ code }}', code);
};
