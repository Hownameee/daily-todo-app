import z from "zod";

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const todoSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, "Title cannot be empty")
		.max(100, "Title is too long")
		.regex(/^[\w\s\-,.!?'"()]+$/, "Title contains invalid characters"),
});

export const updateTodoSchema = z.object({
	id: z.string().regex(OBJECT_ID_REGEX, "Invalid MongoDB ObjectId"),
	completed: z.boolean(),
	title: z
		.string()
		.trim()
		.min(1, "Title cannot be empty")
		.max(100, "Title is too long")
		.regex(/^[\w\s\-,.!?'"()]+$/, "Title contains invalid characters"),
});

export const removeTodoSchema = z.object({ id: z.string().regex(OBJECT_ID_REGEX, "Invalid MongoDB ObjectId") });
