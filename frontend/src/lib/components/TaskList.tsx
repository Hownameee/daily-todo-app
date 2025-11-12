import { useState, type Dispatch, type SetStateAction } from "react";
import { RemoveTaskRequestSchema, TaskSchema, type Task } from "../gen/todos_pb";
import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import { ResponseSchema, Status } from "../gen/response_pb";
import { PencilIcon, TrashIcon } from "@assets/index";
import SubmitButtonSpinner from "./SubmitButtonSpinner";

export default function TaskList({ todos, setTodos }: { todos: Task[]; setTodos: Dispatch<SetStateAction<Task[]>> }) {
	const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
	const [editingTodoTitle, setEditingTodoTitle] = useState<string>("");

	const handleDeleteTodo = async (uuid: string) => {
		const id = create(RemoveTaskRequestSchema, { uuid: uuid });
		const bytes = toBinary(RemoveTaskRequestSchema, id);

		const res = await fetch("/api/todos", { credentials: "include", method: "DELETE", body: bytes, headers: { "Content-Type": "application/x-protobuf" } });

		const data = await res.arrayBuffer();
		const status = fromBinary(ResponseSchema, new Uint8Array(data));
		if (status.status == Status.SUCCESS) {
			setTodos(todos.filter((todo) => todo.uuid !== uuid));
		}
	};

	const handleToggleComplete = async (todo: Task) => {
		const updateTask = create(TaskSchema, { uuid: todo.uuid, title: todo.title, completed: !todo.completed });
		const bytes = toBinary(TaskSchema, updateTask);

		const res = await fetch("/api/todos", { credentials: "include", method: "PUT", body: bytes, headers: { "Content-Type": "application/x-protobuf" } });

		const data = await res.arrayBuffer();
		const status = fromBinary(ResponseSchema, new Uint8Array(data));
		if (status.status == Status.SUCCESS) {
			setTodos((prev) =>
				prev.map((e) => {
					return e.uuid === todo.uuid ? { ...e, completed: !todo.completed } : e;
				}),
			);
		}
	};

	const handleStartEdit = (todo: Task) => {
		setEditingTodoId(todo.uuid);
		setEditingTodoTitle(todo.title);
	};

	const handleCancelEdit = () => {
		setEditingTodoId(null);
		setEditingTodoTitle("");
	};

	const handleUpdateTodo = async (todo: Task) => {
		if (editingTodoTitle.trim() === "") {
			return;
		}

		const updateTask = create(TaskSchema, { uuid: todo.uuid, title: editingTodoTitle, completed: todo.completed });
		const bytes = toBinary(TaskSchema, updateTask);

		const res = await fetch("/api/todos", { headers: { "Content-Type": "application/x-protobuf" }, credentials: "include", method: "PUT", body: bytes });

		const data = await res.arrayBuffer();
		const status = fromBinary(ResponseSchema, new Uint8Array(data));

		if (status.status == Status.SUCCESS) {
			setTodos((prev) =>
				prev.map((e) => {
					return e.uuid === todo.uuid ? { ...e, title: editingTodoTitle } : e;
				}),
			);
		}
		handleCancelEdit();
	};

	return (
		<>
			{todos.length > 0 ? (
				todos.map((todo) => (
					<li key={todo.uuid}>
						{editingTodoId === todo.uuid ? (
							<form action={() => handleUpdateTodo(todo)} className="flex gap-2 p-3 bg-white/40 rounded-lg">
								<input type="text" value={editingTodoTitle} onChange={(e) => setEditingTodoTitle(e.target.value)} className="grow p-2 rounded-lg bg-white/50 border border-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" autoFocus />
								<SubmitButtonSpinner value="Save" className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition" />
								<button type="button" onClick={handleCancelEdit} className="p-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition">
									Cancel
								</button>
							</form>
						) : (
							<div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg group">
								<input type="checkbox" checked={todo.completed} onChange={() => handleToggleComplete(todo)} className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500" />

								<span className={`grow text-gray-900 truncate ${todo.completed ? "text-gray-500 opacity-40" : ""}`}>{todo.title}</span>

								<button onClick={() => handleStartEdit(todo)} className="p-2 rounded-md text-gray-600 hover:bg-gray-500/20 hover:text-gray-900 transition opacity-30 group-hover:opacity-100 cursor-pointer">
									<PencilIcon />
								</button>

								<button onClick={() => handleDeleteTodo(todo.uuid)} className="p-2 rounded-md text-red-500 hover:bg-red-500/20 hover:text-red-700 transition opacity-30 group-hover:opacity-100 cursor-pointer">
									<TrashIcon />
								</button>
							</div>
						)}
					</li>
				))
			) : (
				<li className="text-gray-500 font-medium text-center opacity-50">Nothing here yet!</li>
			)}
		</>
	);
}
