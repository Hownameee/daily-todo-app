import { NextFunction, Request, Response } from "express";
import z from "zod";

export default function validation(schema: z.ZodObject) {
	return function (req: Request, _: Response, next: NextFunction) {
		try {
			schema.parse(req.body);
		} catch (err) {
			return next(err);
		}
		return next();
	};
}
