import express, { NextFunction, Request, Response } from "express";
import { register } from "../prometheus/prometheus";

const metricsRouter = express.Router();

metricsRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
	const allowedIPs = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];

	if (!req.ip) {
		return next();
	}

	if (!allowedIPs.includes(req.ip)) {
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
