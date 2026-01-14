import { NextFunction, Request, Response } from "express";
import authService from "../services/auth";

export default function requiredToken(req: Request, res: Response, next: NextFunction) {
	try {
		const payload = authService.validateToken(req.cookies.token);
		res.locals.user = payload.username;
		res.locals.authenticated = true;
		next();
	} catch (err) {
		next(err);
	}
}
