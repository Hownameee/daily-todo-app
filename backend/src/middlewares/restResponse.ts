import { Request, Response, NextFunction } from "express";
import toProto from "../services/proto";
import { ResponseSchema } from "../controllers/gen/response_pb";
import { create } from "@bufbuild/protobuf";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Response {
			created: (data: Uint8Array | null) => void;
			ok: (data: Uint8Array | null) => void;

			unauthorized: (message?: string) => void;
			notFound: (message?: string) => void;
			conflict: (message?: string) => void;
			badRequest: (message?: string) => void;
			internalError: (message?: string) => void;
		}
	}
}

export default function restResponse(req: Request, res: Response, next: NextFunction) {
	res.created = (data: Uint8Array | null) => {
		res.status(201).send(data);
	};

	res.ok = (data: Uint8Array | null) => {
		res.status(200).send(data);
	};

	res.unauthorized = (message = "Unauthorized") => {
		const data = toProto(ResponseSchema, create(ResponseSchema, { message }));
		res.status(401).send(data);
	};

	res.notFound = (message = "Not found") => {
		const data = toProto(ResponseSchema, create(ResponseSchema, { message }));
		res.status(404).send(data);
	};

	res.conflict = (message = "Conflict") => {
		const data = toProto(ResponseSchema, create(ResponseSchema, { message }));
		res.status(409).send(data);
	};

	res.badRequest = (message = "Bad Request") => {
		const data = toProto(ResponseSchema, create(ResponseSchema, { message }));
		res.status(400).send(data);
	};

	res.internalError = (message = "Internal server error, please try again later!") => {
		const data = toProto(ResponseSchema, create(ResponseSchema, { message }));
		res.status(500).send(data);
	};

	next();
}
