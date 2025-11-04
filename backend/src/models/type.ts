import { ObjectId } from "mongodb";
export type Task = { uuid: string; title: string; completed: boolean };
export type User = { _id: ObjectId; uuid: string; username: string; password: string; tasks: Task[] };
