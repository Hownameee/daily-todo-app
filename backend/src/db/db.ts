import { connect, disconnect } from "mongoose";
import config from "../config/config";

export function connectDB() {
	connect(config.MongoUri, { dbName: "daily_todo" }).then(() => {
		// eslint-disable-next-line no-console
		console.log("Connected to database");
	});
}

export async function disconnectDB() {
	try {
		await disconnect();
		// eslint-disable-next-line no-console
		console.log("Disconnected from database");
	} catch (error) {
		console.error("Error disconnecting from database:", error);
	}
}
