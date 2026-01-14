import { InferSchemaType, model, Schema, Types } from "mongoose";

const todoItemSchema = new Schema({ title: String, completed: Boolean });

const userSchema = new Schema({ username: { type: String, required: true, unique: true }, password: { type: String, required: true }, todos: [todoItemSchema] });

export type Todo = InferSchemaType<typeof todoItemSchema> & { _id: Types.ObjectId };
export type User = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };

const UserModel = model("User", userSchema);

export default UserModel;
