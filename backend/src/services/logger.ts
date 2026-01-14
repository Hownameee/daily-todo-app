function createErrorLog() {
	function logger(err: unknown, username: string | undefined) {
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
		const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

		if (err instanceof Error) {
			console.error(`[${hours}:${formattedMinutes}:${formattedSeconds} - ${username ? username : "unknown"}] ${err.message}`);
		} else {
			console.error(`[${hours}:${minutes}:${seconds} - ${username ?? "unknown"}]:`);
			console.error(err);
		}
	}
	return logger;
}

const logger = createErrorLog();

export default logger;
