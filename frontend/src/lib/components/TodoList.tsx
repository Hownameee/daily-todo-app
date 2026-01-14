import { useCallback, type Dispatch, type SetStateAction } from "react";
import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import { ResponseSchema } from "src/lib/gen/response_pb";
import { RemoveTodoRequestSchema, TodoSchema, type Todo } from "../gen/todo_pb";
import { MemoTodoItem } from "./Todo";

export default function TodoList({ todos, setTodos }: { todos: Todo[]; setTodos: Dispatch<SetStateAction<Todo[]>> }) {
	const handleDeleteTodo = useCallback(
		async (id: string) => {
			try {
				const data = create(RemoveTodoRequestSchema, { id: id });
				const bytes = toBinary(RemoveTodoRequestSchema, data);
				const res = await fetch("/api/todo", { credentials: "include", method: "DELETE", body: bytes, headers: { "Content-Type": "application/x-protobuf" } });

				if (res.ok) {
					setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
				} else {
					const data = await res.arrayBuffer();
					const status = fromBinary(ResponseSchema, new Uint8Array(data));
					alert(status.message);
				}
			} catch {
				alert("Internal server error, please try again.");
			}
		},
		[setTodos],
	);

	const handleToggleComplete = useCallback(
		async (todo: Todo) => {
			try {
				const updateTodo = create(TodoSchema, { id: todo.id, title: todo.title, completed: !todo.completed });
				const bytes = toBinary(TodoSchema, updateTodo);
				const res = await fetch("/api/todo", { credentials: "include", method: "PUT", body: bytes, headers: { "Content-Type": "application/x-protobuf" } });

				if (res.ok) {
					setTodos((prevTodos) =>
						prevTodos.map((e) => {
							return e.id === todo.id ? { ...e, completed: !e.completed } : e;
						}),
					);
				} else {
					const data = await res.arrayBuffer();
					const { message } = fromBinary(ResponseSchema, new Uint8Array(data));
					alert(message);
				}
			} catch {
				alert("Internal server error, please try again.");
			}
		},
		[setTodos],
	);

	const handleUpdateTodo = useCallback(
		async (todo: Todo, newTitle: string) => {
			if (newTitle.trim() === "") {
				return;
			}
			const updateTodo = create(TodoSchema, { id: todo.id, title: newTitle, completed: todo.completed });
			const bytes = toBinary(TodoSchema, updateTodo);

			try {
				const res = await fetch("/api/todo", { headers: { "Content-Type": "application/x-protobuf" }, credentials: "include", method: "PUT", body: bytes });
				if (res.ok) {
					setTodos((prevTodos) =>
						prevTodos.map((e) => {
							return e.id === todo.id ? { ...e, title: newTitle } : e;
						}),
					);
				} else {
					const data = await res.arrayBuffer();
					const status = fromBinary(ResponseSchema, new Uint8Array(data));
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
				todos.map((todo, index) => <MemoTodoItem key={todo.id} todo={todo} index={index} onDelete={handleDeleteTodo} onToggle={handleToggleComplete} onUpdate={handleUpdateTodo} />)
			) : (
				<li className="flex flex-col items-center justify-center py-10 text-slate-500 opacity-60">
					<div className="w-12 h-12 mb-3 border-2 border-slate-700 rounded-full border-dashed animate-spin-slow"></div>
					<span className="font-medium italic">Nothing here yet!</span>
				</li>
			)}
		</ul>
	);
}
