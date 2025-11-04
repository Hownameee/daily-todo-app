import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { ResponseSchema, Status } from "src/lib/gen/response_pb";
import { AddTaskRequestSchema, AddTaskResponseSchema, RemoveTaskRequestSchema, TaskListResponseSchema, TaskSchema, type Task } from "src/lib/gen/todos_pb";
import { PencilIcon, TrashIcon } from "@assets/index";

function Home() {
	const navigate = useNavigate();

	const [todos, setTodos] = useState<Task[]>([]);
	const [newTodoTitle, setNewTodoTitle] = useState<string>("");

	const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
	const [editingTodoTitle, setEditingTodoTitle] = useState<string>("");

	const handleLogout = async () => {
		await fetch("/api/logout", { credentials: "include" });
		await navigate("/login");
	};

	const handleAddTodo = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newTodoTitle.trim() === "") {
			return;
		}

		const task = create(AddTaskRequestSchema, { title: newTodoTitle });
		const bytes = toBinary(AddTaskRequestSchema, task);
		const res = await fetch("/api/todos", { headers: { "Content-Type": "application/x-protobuf" }, method: "POST", credentials: "include", body: bytes });

		const data = await res.arrayBuffer();
		const newTask = fromBinary(AddTaskResponseSchema, new Uint8Array(data));

		if (newTask.status == Status.SUCCESS && newTask.newTask) {
			setTodos([newTask.newTask, ...todos]);
		}
		setNewTodoTitle("");
	};

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

	const handleUpdateTodo = async (e: FormEvent<HTMLFormElement>, todo: Task) => {
		e.preventDefault();
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

	useEffect(() => {
		const fetchTodos = async () => {
			const res = await fetch("/api/todos", { credentials: "include" });
			const data = await res.arrayBuffer();
			const todos = fromBinary(TaskListResponseSchema, new Uint8Array(data));
			setTodos(todos.list);
		};

		fetchTodos();
	}, []);

	return (
		<div className="flex justify-center items-start w-full h-full px-4 md:px-8 overflow-y-auto">
			<div className="w-full max-w-2xl p-6 md:p-8 bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-black/10">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-900">Todo List</h1>
					<button onClick={handleLogout} className="py-2 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition duration-300 shadow-md">
						Logout
					</button>
				</div>

				<form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
					<input
						type="text"
						value={newTodoTitle}
						onChange={(e) => setNewTodoTitle(e.target.value)}
						placeholder="Add new task..."
						className="grow p-3 rounded-lg bg-white/50 border border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
					<button type="submit" className="py-3 px-5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-300 shadow-md">
						Add
					</button>
				</form>

				<ul className="space-y-3">
					{todos.map((todo) => (
						<li key={todo.uuid}>
							{editingTodoId === todo.uuid ? (
								<form onSubmit={(e) => handleUpdateTodo(e, todo)} className="flex gap-2 p-3 bg-white/40 rounded-lg">
									<input type="text" value={editingTodoTitle} onChange={(e) => setEditingTodoTitle(e.target.value)} className="grow p-2 rounded-lg bg-white/50 border border-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" autoFocus />
									<button type="submit" className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
										Save
									</button>
									<button type="button" onClick={handleCancelEdit} className="p-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition">
										Cancel
									</button>
								</form>
							) : (
								<div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg group">
									<input type="checkbox" checked={todo.completed} onChange={() => handleToggleComplete(todo)} className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500" />

									<span className={`grow text-gray-900 ${todo.completed ? "line-through text-gray-500" : ""}`}>{todo.title}</span>

									<button onClick={() => handleStartEdit(todo)} className="p-2 rounded-md text-gray-600 hover:bg-gray-500/20 hover:text-gray-900 transition opacity-0 group-hover:opacity-100">
										<PencilIcon />
									</button>

									<button onClick={() => handleDeleteTodo(todo.uuid)} className="p-2 rounded-md text-red-500 hover:bg-red-500/20 hover:text-red-700 transition opacity-0 group-hover:opacity-100">
										<TrashIcon />
									</button>
								</div>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default Home;
