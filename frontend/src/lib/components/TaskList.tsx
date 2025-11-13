import { useState, type Dispatch, type SetStateAction } from "react";
import { RemoveTaskRequestSchema, TaskSchema, type Task } from "../gen/todos_pb";
import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import { ResponseSchema, Status } from "../gen/response_pb";
import SubmitButtonSpinner from "./SubmitButtonSpinner";
import { CheckCircleIcon, MoreVerticalIcon } from "./ReactIcons";
import { PencilIcon, TrashIcon } from "@assets/index";

export default function TaskList({ todos, setTodos }: { todos: Task[]; setTodos: Dispatch<SetStateAction<Task[]>> }) {
	const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
	const [editingTodoTitle, setEditingTodoTitle] = useState<string>("");
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
		setOpenMenuId(null);
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

		try {
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
		} catch (error) {
			console.error("Failed to update todo:", error);
		} finally {
			handleCancelEdit();
		}
	};

	const toggleOptions = (uuid: string) => {
		setOpenMenuId(openMenuId === uuid ? null : uuid);
	};

	return (
		<>
			{todos.length > 0 ? (
				todos.map((todo, index) => (
					<li key={todo.uuid} className="relative">
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
								<span className={`grow text-gray-900 truncate ${todo.completed ? "text-gray-500 opacity-60" : ""}`}>
									<span className={`${todo.completed ? "text-green-400" : "text-red-400"}`}>{"T" + (index + 1) + ": "}</span>
									{todo.title}
								</span>
								<button
									onClick={() => handleToggleComplete(todo)}
									className={`shrink-0 ${todo.completed ? "text-green-600" : "text-gray-400 hover:text-gray-600"} 
                                    transition-all duration-200 ease-out active:scale-90`}>
									<CheckCircleIcon completed={todo.completed} />
								</button>
								<button onClick={() => toggleOptions(todo.uuid)} className="p-2 rounded-full text-gray-500 hover:bg-gray-500/20 hover:text-gray-800 transition-all opacity-30 group-hover:opacity-100">
									<MoreVerticalIcon />
								</button>
							</div>
						)}

						{openMenuId === todo.uuid && (
							<div className="absolute right-0 top-[calc(100%-10px)] z-10 w-36 bg-white rounded-lg shadow-lg border border-gray-200" onMouseLeave={() => setOpenMenuId(null)}>
								<button onClick={() => handleStartEdit(todo)} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
									<PencilIcon />
									Edit
								</button>
								<button onClick={() => handleDeleteTodo(todo.uuid)} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
									<TrashIcon />
									Delete
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
