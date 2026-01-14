import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import TodoList from "@components/TodoList";
import SubmitButtonSpinner from "@components/SubmitButtonSpinner";
import { TrophySpin } from "react-loading-indicators";
import { ResponseSchema } from "src/lib/gen/response_pb";
import { AddTodoRequestSchema, AddTodoResponseSchema, TodoListResponseSchema, type Todo } from "src/lib/gen/todo_pb";

type FilterState = "all" | "not done" | "done";

function calculateRemainingTime() {
	const now = new Date();
	const midnight = new Date();
	midnight.setHours(24, 0, 0, 0);

	const diff = midnight.getTime() - now.getTime();

	const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
	const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
	const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");

	return `${hours}:${minutes}:${seconds}`;
}

function Home() {
	// console.log("home-re-render");

	const navigate = useNavigate();

	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [filter, setFilter] = useState<FilterState>("all");
	const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

	const handleLogout = async () => {
		try {
			await fetch("/api/logout", { credentials: "include" });
			navigate("/login");
		} catch {
			alert("Internal server error, please try again.");
		}
	};

	const handleAddTodo = async (formData: FormData) => {
		const todoForm = formData.get("todo")?.toString();

		if (!todoForm || todoForm.trim() === "") {
			return;
		}
		try {
			const todo = create(AddTodoRequestSchema, { title: todoForm });
			const bytes = toBinary(AddTodoRequestSchema, todo);
			const res = await fetch("/api/todo", { headers: { "Content-Type": "application/x-protobuf" }, method: "POST", credentials: "include", body: bytes });
			const data = await res.arrayBuffer();

			if (res.status === 201) {
				const newTodo = fromBinary(AddTodoResponseSchema, new Uint8Array(data));
				if (newTodo.newTodo) {
					setTodos([newTodo.newTodo, ...todos]);
				}
			} else {
				const result = fromBinary(ResponseSchema, new Uint8Array(data));
				alert(result.message);
			}
		} catch {
			alert("Internal server error, please try again.");
		}
	};

	useEffect(() => {
		const fetchTodos = async () => {
			try {
				const res = await fetch("/api/todo", { credentials: "include" });
				const data = await res.arrayBuffer();
				const todos = fromBinary(TodoListResponseSchema, new Uint8Array(data));
				setLoading(false);
				setTodos(todos.list);
			} catch {
				alert("Internal server error, please try again.");
			}
		};

		fetchTodos();
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setRemainingTime(calculateRemainingTime());
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	const filteredTodos = useMemo(() => {
		if (filter === "done") {
			return todos.filter((todo) => todo.completed);
		}
		if (filter === "not done") {
			return todos.filter((todo) => !todo.completed);
		}
		return todos;
	}, [todos, filter]);

	return (
		<main className="flex justify-center items-start w-full px-4 md:px-8 flex-1 pb-8 min-h-0">
			<div className="w-full max-w-2xl p-4 sm:p-6 md:p-8 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex flex-col gap-5 h-full overflow-y-hidden ring-1 ring-white/5 animate-fade-in-up">
				<div className="flex justify-between items-center flex-wrap gap-2 border-b border-white/10 pb-4">
					<h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-md">Daily Todo List</h1>
					<form action={handleLogout}>
						<SubmitButtonSpinner
							value="Logout"
							className="py-2 px-4 rounded-lg bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold shadow-lg shadow-red-900/20 transition-all duration-300 cursor-pointer text-sm sm:text-base border border-white/10"
						/>
					</form>
				</div>

				<form action={handleAddTodo} className="flex flex-col sm:flex-row gap-3">
					<input
						type="text"
						name="todo"
						placeholder="Add new todo..."
						className="w-full sm:grow p-3.5 rounded-xl bg-black/40 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 shadow-inner"
						required
					/>

					<SubmitButtonSpinner
						value="Add"
						className="w-full sm:w-auto py-3 px-6 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer border border-white/10"
					/>
				</form>

				{todos.length > 0 ? (
					<div className="text-center shrink-0 text-xs text-slate-400 font-mono bg-white/5 py-1 rounded-md border border-white/5" title="Time remaining today">
						Time remaining: <span className="text-cyan-400 font-semibold">{remainingTime}</span>
					</div>
				) : null}

				<div className="flex w-full gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
					<button
						type="button"
						onClick={() => setFilter("all")}
						className={`flex-1 py-2 rounded-lg text-sm font-medium border border-transparent
                        ${filter === "all" ? "bg-linear-to-r from-slate-700 to-slate-600 text-white shadow-md border border-white/10" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>
						All
					</button>
					<button
						type="button"
						onClick={() => setFilter("not done")}
						className={`flex-1 py-2 rounded-lg text-sm font-medium border border-transparent
                        ${filter === "not done" ? "bg-linear-to-r from-cyan-900/80 to-blue-900/80 text-cyan-100 shadow-md border border-white/10" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>
						Not Done
					</button>
					<button
						type="button"
						onClick={() => setFilter("done")}
						className={`flex-1 py-2 rounded-lg text-sm font-medium border border-transparent
                        ${filter === "done" ? "bg-linear-to-r from-purple-900/80 to-pink-900/80 text-purple-100 shadow-md border border-white/10" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>
						Done
					</button>
				</div>

				<ul className="space-y-3 flex-1 min-h-0 overflow-y-auto no-scrollbar [mask:linear-gradient(to_bottom,black_90%,transparent_100%)] pr-1">
					{loading ? (
						<li className="flex justify-center items-center h-full bg-">
							<TrophySpin color={["#9810fa", "#00b8db", "#e60076", "#372aac"]} />
						</li>
					) : (
						<TodoList todos={filteredTodos} setTodos={setTodos}></TodoList>
					)}
				</ul>
			</div>
		</main>
	);
}

export default Home;
