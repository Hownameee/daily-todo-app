import { Response } from "express";
import { Message, toBinary } from "@bufbuild/protobuf";
import { GenMessage } from "@bufbuild/protobuf/codegenv2";

export function sendProto<T extends Message<string>>(res: Response, schema: GenMessage<T>, message: T) {
	try {
		const data = toBinary(schema, message);
		res.send(data);
	} catch (err) {
		res.sendStatus(500);
		throw err;
	}
}
