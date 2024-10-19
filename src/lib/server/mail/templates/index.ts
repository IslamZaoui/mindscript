import emailVerificationHTML from './email-verification.html?raw';

export const emailVerificationTemplate = (code: string) => {
	return emailVerificationHTML.replace('{{ code }}', code);
};
