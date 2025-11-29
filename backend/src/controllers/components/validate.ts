import { z } from "zod";
import { sendProto } from "./helper";
import { Response } from "express";
import { ResponseSchema, Status } from "../gen/response_pb";
import { create } from "@bufbuild/protobuf";

const passwordError = "Password must be 8–100 characters long and contain lowercase, uppercase, number, and special character.";
const UUIDV7_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const loginSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be between 3 and 20 characters.")
		.max(20, "Username must be between 3 and 20 characters.")
		.regex(/^[a-zA-Z0-9._]+$/, "Username can only contain letters, numbers, dot and underscore.")
		.refine((val) => !/^[._]/.test(val) && !/[._]$/.test(val), "Username cannot start or end with dot/underscore.")
		.refine((val) => !/(\.\.|__)/.test(val), "Username cannot contain consecutive dots or underscores.")
		.refine((val) => !/^\d+$/.test(val), "Username cannot be only digits.")
		.refine((val) => !["admin", "root", "system"].includes(val.toLowerCase()), "Username is not allowed."),
	password: z
		.string()
		.min(8, passwordError)
		.max(100, passwordError)
		.regex(/[a-z]/, passwordError)
		.regex(/[A-Z]/, passwordError)
		.regex(/[0-9]/, passwordError)
		.regex(/[!@#$%^&*(),.?":{}|<>]/, passwordError),
});

const taskSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, "Title cannot be empty")
		.max(100, "Title is too long")
		.regex(/^[\w\s\-,.!?'"()]+$/, "Title contains invalid characters"),
});

const updateTaskSchema = z.object({
	uuid: z.string().regex(UUIDV7_REGEX, "Invalid UUIDv7 format."),
	completed: z.boolean(),
	title: z
		.string()
		.trim()
		.min(1, "Title cannot be empty")
		.max(100, "Title is too long")
		.regex(/^[\w\s\-,.!?'"()]+$/, "Title contains invalid characters"),
});

const removeTaskSchema = z.object({ uuid: z.string().regex(UUIDV7_REGEX, "Invalid UUIDv7 format.") });

export function checkUserConstraint(res: Response, username: string, password: string): boolean {
	const result = loginSchema.safeParse({ username, password });
	if (!result.success) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: result.error.issues[0].message }));
		return false;
	}
	return true;
}

export function checkTaskConstraint(res: Response, title: string): boolean {
	const result = taskSchema.safeParse({ title });
	if (!result.success) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: result.error.issues[0].message }));
		return false;
	}
	return true;
}

export function checkUpdateTaskConstraint(res: Response, uuid: string, completed: boolean, title: string): boolean {
	const result = updateTaskSchema.safeParse({ uuid, completed, title });
	if (!result.success) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: result.error.issues[0].message }));
		return false;
	}
	return true;
}

export function checkRemoveTaskConstraint(res: Response, uuid: string): boolean {
	const result = removeTaskSchema.safeParse({ uuid });
	if (!result.success) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: result.error.issues[0].message }));
		return false;
	}
	return true;
}
