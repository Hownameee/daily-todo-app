import { NextFunction, Request, Response } from "express";
import { httpRequestDurationSeconds, httpRequestsTotal } from "../prometheus/prometheus";

export default function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
	if (req.originalUrl.startsWith("/metrics")) {
		return next();
	}

	const endTimer = httpRequestDurationSeconds.startTimer();

	res.on("finish", () => {
		const route = req.route ? req.baseUrl + req.route.path : req.path;
		const method = req.method;
		const statusCode = res.statusCode;
		httpRequestsTotal.inc({ method: method, route: route, status_code: statusCode });
		endTimer({ method: method, route: route, status_code: statusCode });
	});

	return next();
}
