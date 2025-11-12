import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Status } from "src/lib/gen/response_pb";
import { AddTaskRequestSchema, AddTaskResponseSchema, TaskListResponseSchema, type Task } from "src/lib/gen/todos_pb";
import TaskList from "@components/TaskList";
import SubmitButtonSpinner from "@components/SubmitButtonSpinner";

function Home() {
	const navigate = useNavigate();

	const [todos, setTodos] = useState<Task[]>([]);

	const handleLogout = async () => {
		await fetch("/api/logout", { credentials: "include" });
		navigate("/login");
	};

	const handleAddTodo = async (formData: FormData) => {
		const taskForm = formData.get("task")?.toString();

		if (!taskForm || taskForm.trim() === "") {
			return;
		}

		const task = create(AddTaskRequestSchema, { title: taskForm });
		const bytes = toBinary(AddTaskRequestSchema, task);
		const res = await fetch("/api/todos", { headers: { "Content-Type": "application/x-protobuf" }, method: "POST", credentials: "include", body: bytes });

		const data = await res.arrayBuffer();
		const newTask = fromBinary(AddTaskResponseSchema, new Uint8Array(data));

		if (newTask.status == Status.SUCCESS && newTask.newTask) {
			setTodos([newTask.newTask, ...todos]);
		}
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
		<div className="flex justify-center items-start w-full px-4 md:px-8 h-4/5">
			<div className="w-full max-w-2xl p-6 md:p-8 bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-black/10 h-full overflow-y-hidden flex flex-col gap-6">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold text-gray-900">Todo List</h1>
					<form action={handleLogout}>
						<SubmitButtonSpinner value="Logout" className="py-2 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition duration-300 shadow-md cursor-pointer" />
					</form>
				</div>

				<form action={handleAddTodo} className="flex gap-2">
					<input type="text" name="task" placeholder="Add new task..." className="grow p-3 rounded-lg bg-white/50 border border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />

					<SubmitButtonSpinner value="Add" className="py-3 px-5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-300 shadow-md cursor-pointer" />
				</form>

				<ul className="space-y-3 overflow-y-scroll [&::-webkit-scrollbar]:hidden flex-1 min-h-0 [mask:linear-gradient(to_bottom,black_95%,transparent_100%)]">
					<TaskList todos={todos} setTodos={setTodos}></TaskList>
				</ul>
			</div>
		</div>
	);
}

export default Home;
