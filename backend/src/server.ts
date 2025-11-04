import openDB, { Models } from "./models/models";
import { Controllers } from "./controllers/controllers";
import serveRoute from "./router/router";
import express from "express";
import Config from "./config/config";
import { Views } from "./views/view";

let models: Models | null = null;

async function main() {
	const config: Config = new Config();
	models = await openDB(config.MongoUri);
	const views: Views = new Views("src/views/gen");
	const controllers = new Controllers(models, config);
	const router = serveRoute(controllers, views);
	const app = express();

	app.use(router);

	// eslint-disable-next-line no-console
	app.listen(config.PORT, () => console.log("Backend server listen on port", config.PORT));
}

main();

process.on("SIGINT", async () => {
	if (models) {
		await models.close();
	}
	process.exit(0);
});
