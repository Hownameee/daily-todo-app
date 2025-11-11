import { ObjectId, UUID } from "mongodb";
export type TaskDB = { uuid: UUID; title: string; completed: boolean };
export type Task = { uuid: string; title: string; completed: boolean };
export type UserDB = { _id: ObjectId; uuid: UUID; username: string; password: string; tasks: TaskDB[] };
// export type User = { _id: ObjectId; uuid: string; username: string; password: string; tasks: TaskDB[] };
