import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import mongoose from "mongoose";
import { ZodError } from "zod";

export default function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
	if (err instanceof ZodError) {
		const errorMessage = err.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
		return res.badRequest(errorMessage);
	}

	if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
		return res.unauthorized("Invalid or expired token");
	}

	if (err instanceof mongoose.Error.ValidationError) {
		const messages = Object.values(err.errors)
			.map((e) => e.message)
			.join("; ");
		return res.badRequest(messages);
	}

	if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
		const field = Object.keys(err.keyValue)[0];
		const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
		return res.conflict(`${fieldName} already exists, please try another one!`);
	}

	if (err instanceof mongoose.Error.CastError) {
		return res.badRequest(`Invalid format for field: ${err.path}`);
	}

	return res.internalError();
}
