import { Response } from "express";
import { create, Message, toBinary } from "@bufbuild/protobuf";
import { ResponseSchema, Status } from "../gen/response_pb";
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

export function checkUsernameConstraint(res: Response, username: string): boolean {
	if (username.length < 3 || username.length > 20) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Username must be between 3 and 20 characters." }));
		return false;
	}

	if (!/^[a-zA-Z0-9._]+$/.test(username)) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Username can only contain letters, numbers, dot and underscore." }));
		return false;
	}

	if (/^[._]/.test(username) || /[._]$/.test(username)) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Username cannot start or end with dot/underscore." }));
		return false;
	}

	if (/(\.\.|__)/.test(username)) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Username cannot contain consecutive dots or underscores." }));
		return false;
	}

	if (/^\d+$/.test(username)) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Username cannot be only digits." }));
		return false;
	}

	const forbidden = ["admin", "root", "system"];
	if (forbidden.includes(username.toLowerCase())) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Username is not allowed." }));
		return false;
	}
	return true;
}

export function checkPasswordConstraint(res: Response, password: string): boolean {
	if (password.length < 8 || password.length > 30) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Password must be 8–30 characters long and contain lowercase, uppercase, number, and special character." }));
		return false;
	}

	if (!/[a-z]/.test(password)) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Password must be 8–30 characters long and contain lowercase, uppercase, number, and special character." }));
		return false;
	}

	if (!/[A-Z]/.test(password)) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Password must be 8–30 characters long and contain lowercase, uppercase, number, and special character." }));
		return false;
	}

	if (!/[0-9]/.test(password)) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Password must be 8–30 characters long and contain lowercase, uppercase, number, and special character." }));
		return false;
	}

	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Password must be 8–30 characters long and contain lowercase, uppercase, number, and special character." }));
		return false;
	}
	return true;
}
