import { Request, Response } from "express";
import userService from "../services/user";
import { create } from "@bufbuild/protobuf";
import toProto from "../services/proto";
import { AddTodoResponseSchema, Todo, TodoListResponseSchema, TodoSchema } from "./gen/todo_pb";
import { Todo as TodoDB } from "../models/user";

const todoController = {
	handleGetTodoList: async (req: Request, res: Response) => {
		const username = res.locals.user;
		const user = await userService.findByUsername(username);
		if (user) {
			const protoTodos = user.todos.map((todo: TodoDB) => create(TodoSchema, { id: todo._id.toString(), title: todo.title ?? undefined, completed: todo.completed ?? undefined }));
			const responseMessage = toProto(TodoListResponseSchema, create(TodoListResponseSchema, { list: protoTodos }));
			res.ok(responseMessage);
			return;
		}
		res.notFound();
	},

	handleRemoveTodo: async (req: Request, res: Response) => {
		const data = req.body;
		await userService.removeTodoByUsername(res.locals.user, data.id);
		res.ok(null);
	},

	handleAddTodo: async (req: Request, res: Response) => {
		const data: Todo = req.body;
		const newTodo = await userService.insertTodoByUsername(res.locals.user, data.title);
		if (newTodo && newTodo.title && typeof newTodo.completed === "boolean" && newTodo._id) {
			const protoTodo = toProto(AddTodoResponseSchema, create(AddTodoResponseSchema, { newTodo: create(TodoSchema, { title: newTodo.title, completed: newTodo.completed, id: newTodo._id.toString() }) }));
			res.created(protoTodo);
			return;
		}
	},
	handleUpdateTodo: async (req: Request, res: Response) => {
		const data: Todo = req.body;
		await userService.updateTodoByUsername(res.locals.user, data.id, data.title, data.completed);
		res.ok(null);
	},
};

export default todoController;
