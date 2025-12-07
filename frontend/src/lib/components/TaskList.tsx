import { useCallback, type Dispatch, type SetStateAction } from "react";
import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import { RemoveTaskRequestSchema, TaskSchema, type Task } from "src/lib/gen/todos_pb";
import { ResponseSchema, Status } from "src/lib/gen/response_pb";
import { MemoTaskItem } from "./Task";

export default function TaskList({ todos, setTodos }: { todos: Task[]; setTodos: Dispatch<SetStateAction<Task[]>> }) {
	const handleDeleteTodo = useCallback(
		async (uuid: string) => {
			try {
				const id = create(RemoveTaskRequestSchema, { uuid: uuid });
				const bytes = toBinary(RemoveTaskRequestSchema, id);
				const res = await fetch("/api/todos", { credentials: "include", method: "DELETE", body: bytes, headers: { "Content-Type": "application/x-protobuf" } });

				const data = await res.arrayBuffer();
				const status = fromBinary(ResponseSchema, new Uint8Array(data));
				if (status.status == Status.SUCCESS) {
					setTodos((prevTodos) => prevTodos.filter((todo) => todo.uuid !== uuid));
				}
				if (status.status == Status.FAILED) {
					alert(status.message);
				}
			} catch {
				alert("Internal server error, please try again.");
			}
		},
		[setTodos],
	);

	const handleToggleComplete = useCallback(
		async (todo: Task) => {
			try {
				const updateTask = create(TaskSchema, { uuid: todo.uuid, title: todo.title, completed: !todo.completed });
				const bytes = toBinary(TaskSchema, updateTask);
				const res = await fetch("/api/todos", { credentials: "include", method: "PUT", body: bytes, headers: { "Content-Type": "application/x-protobuf" } });

				const data = await res.arrayBuffer();
				const status = fromBinary(ResponseSchema, new Uint8Array(data));
				if (status.status == Status.SUCCESS) {
					setTodos((prevTodos) =>
						prevTodos.map((e) => {
							return e.uuid === todo.uuid ? { ...e, completed: !e.completed } : e;
						}),
					);
				}
				if (status.status == Status.FAILED) {
					alert(status.message);
				}
			} catch {
				alert("Internal server error, please try again.");
			}
		},
		[setTodos],
	);

	const handleUpdateTodo = useCallback(
		async (todo: Task, newTitle: string) => {
			if (newTitle.trim() === "") {
				return;
			}
			const updateTask = create(TaskSchema, { uuid: todo.uuid, title: newTitle, completed: todo.completed });
			const bytes = toBinary(TaskSchema, updateTask);

			try {
				const res = await fetch("/api/todos", { headers: { "Content-Type": "application/x-protobuf" }, credentials: "include", method: "PUT", body: bytes });
				const data = await res.arrayBuffer();
				const status = fromBinary(ResponseSchema, new Uint8Array(data));
				if (status.status == Status.SUCCESS) {
					setTodos((prevTodos) =>
						prevTodos.map((e) => {
							return e.uuid === todo.uuid ? { ...e, title: newTitle } : e;
						}),
					);
				}
				if (status.status == Status.FAILED) {
					alert(status.message);
				}
			} catch (error) {
				console.error("Failed to update todo:", error);
			}
		},
		[setTodos],
	);

	return (
		<ul className="space-y-3 pb-2">
			{todos.length > 0 ? (
				todos.map((todo, index) => <MemoTaskItem key={todo.uuid} todo={todo} index={index} onDelete={handleDeleteTodo} onToggle={handleToggleComplete} onUpdate={handleUpdateTodo} />)
			) : (
				<li className="flex flex-col items-center justify-center py-10 text-slate-500 opacity-60">
					<div className="w-12 h-12 mb-3 border-2 border-slate-700 rounded-full border-dashed animate-spin-slow"></div>
					<span className="font-medium italic">Nothing here yet!</span>
				</li>
			)}
		</ul>
	);
}
