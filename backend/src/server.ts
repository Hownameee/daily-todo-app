import app from "./app";
import config from "./config/config";
import { disconnectDB } from "./db/db";

const server = app.listen(config.PORT, () => {
	// eslint-disable-next-line no-console
	console.log("Backend server listen on port", config.PORT);
});

// graceful shutdown
process.on("SIGINT", async () => {
	// eslint-disable-next-line no-console
	console.log("SIGINT received. Shutting down...");

	server.close(() => {
		// eslint-disable-next-line no-console
		console.log("Backend server closed.");
	});

	await disconnectDB();

	process.exit(0);
});
