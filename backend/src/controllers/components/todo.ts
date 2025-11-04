import { Request, Response } from "express";
import { Controllers } from "../controllers";
import { create, fromBinary } from "@bufbuild/protobuf";
import { sendProto } from "./helper";
import { ResponseSchema, Status } from "../gen/response_pb";
import { AddTaskRequestSchema, AddTaskResponseSchema, RemoveTaskRequestSchema, TaskListResponseSchema, TaskSchema } from "../gen/todos_pb";

Controllers.prototype.handleAddTask = async function (req: Request, res: Response) {
	try {
		const username = res.locals.user;
		const data = fromBinary(AddTaskRequestSchema, req.body);

		const result = await this.models.insertTaskByUsername(username, data.title);
		if (result) {
			sendProto(res, AddTaskResponseSchema, create(AddTaskResponseSchema, { status: Status.SUCCESS, message: "", newTask: result }));
		} else {
			sendProto(res, AddTaskResponseSchema, create(AddTaskResponseSchema, { status: Status.FAILED, message: "Internal server error, please try again." }));
		}
	} catch (err) {
		sendProto(res, AddTaskResponseSchema, create(AddTaskResponseSchema, { status: Status.FAILED, message: "Internal server error, please try again." }));
		this.logger(err, res.locals.user);
	}
};

Controllers.prototype.handleGetTaskList = async function (req: Request, res: Response) {
	try {
		const username = res.locals.user;
		const result = await this.models.selectTaskByUsername(username);
		if (result) {
			sendProto(res, TaskListResponseSchema, create(TaskListResponseSchema, { status: Status.SUCCESS, message: "", list: [...result] }));
		} else {
			sendProto(res, TaskListResponseSchema, create(TaskListResponseSchema, { status: Status.FAILED, message: "Internal server error, please try again." }));
		}
	} catch (err) {
		sendProto(res, TaskListResponseSchema, create(TaskListResponseSchema, { status: Status.FAILED, message: "Internal server error, please try again." }));
		this.logger(err, res.locals.user);
	}
};

Controllers.prototype.handleRemoveTask = async function (req: Request, res: Response) {
	try {
		const username = res.locals.user;
		const data = fromBinary(RemoveTaskRequestSchema, req.body);

		const result = await this.models.removeTaskByUsername(username, data.uuid);

		if (result) {
			sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.SUCCESS, message: "" }));
		} else {
			sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Task not found or already deleted." }));
		}
	} catch (err) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Internal server error, please try again." }));
		this.logger(err, res.locals.user);
	}
};

Controllers.prototype.handleUpdateTask = async function (req: Request, res: Response) {
	try {
		const username = res.locals.user;
		const data = fromBinary(TaskSchema, req.body);

		const result = await this.models.updateTaskByUsername(username, data);

		if (result) {
			sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.SUCCESS, message: "" }));
		} else {
			sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Internal server error, please try again." }));
		}
	} catch (err) {
		sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Internal server error, please try again." }));
		this.logger(err, res.locals.user);
	}
};
