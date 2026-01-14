import { fromBinary, Message } from "@bufbuild/protobuf";
import { GenMessage } from "@bufbuild/protobuf/codegenv2";
import { NextFunction, Request, Response } from "express";

export default function parseProto<T extends Message<string>>(schema: GenMessage<T>) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.body || !Buffer.isBuffer(req.body)) {
				return res.status(400);
			}
			const data = fromBinary(schema, req.body);
			req.body = data;
		} catch (err) {
			next(err);
		}
		return next();
	};
}
