import express, { NextFunction, Request, Response } from "express";
import { register } from "../prometheus/prometheus";
import config from "../config/config";

const metricsRouter = express.Router();

metricsRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (authHeader !== `Bearer ${config.PROMETHEUS_TOKEN}`) {
		return next();
	}

	try {
		res.set("Content-Type", register.contentType);
		const metrics = await register.metrics();
		return res.send(metrics);
	} catch (error) {
		return res.status(500).send("Error generating metrics: " + error);
	}
});

export default metricsRouter;
