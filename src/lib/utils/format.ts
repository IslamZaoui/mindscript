export function formatTime(seconds: number) {
	const min = Math.floor(seconds / 60);
	const sec = seconds % 60;

	return `${min > 0 ? `${min} minutes and ` : ''}${sec} seconds`;
}
