import { useState, memo } from "react";
import type { Task } from "../gen/todos_pb";
import SubmitButtonSpinner from "./SubmitButtonSpinner";
import { CheckCircleIcon, MoreVerticalIcon } from "./ReactIcons";
import { PencilIcon, TrashIcon } from "@assets/index";

type TodoItemProps = { todo: Task; index: number; onDelete: (uuid: string) => Promise<void>; onToggle: (todo: Task) => Promise<void>; onUpdate: (todo: Task, newTitle: string) => Promise<void> };

function TaskItem({ todo, index, onDelete, onToggle, onUpdate }: TodoItemProps) {
	// console.log(`item-re-render: ${todo.title}`);

	const [isEditing, setIsEditing] = useState(false);
	const [editingTodoTitle, setEditingTodoTitle] = useState(todo.title);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleStartEdit = () => {
		setEditingTodoTitle(todo.title);
		setIsEditing(true);
		setIsMenuOpen(false);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
	};

	const toggleOptions = () => {
		setIsMenuOpen((prev) => !prev);
	};

	const handleSaveChanges = async () => {
		if (editingTodoTitle.trim() === "") {
			return;
		}

		await onUpdate(todo, editingTodoTitle);

		setIsEditing(false);
	};

	return (
		<li className="relative">
			{isEditing ? (
				<form action={handleSaveChanges} className="flex gap-2 p-3 bg-white/40 rounded-lg">
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
						onClick={() => onToggle(todo)}
						className={`shrink-0 ${todo.completed ? "text-green-600" : "text-gray-400 hover:text-gray-600"} 
                        transition-all duration-200 ease-out active:scale-90`}>
						<CheckCircleIcon completed={todo.completed} />
					</button>
					<button onClick={toggleOptions} className="p-2 rounded-full text-gray-500 hover:bg-gray-500/20 hover:text-gray-800 transition-all opacity-30 group-hover:opacity-100">
						<MoreVerticalIcon />
					</button>
				</div>
			)}

			{isMenuOpen && (
				<div className="absolute right-0 top-[calc(100%-10px)] z-10 w-36 bg-white rounded-lg shadow-lg border border-gray-200" onMouseLeave={() => setIsMenuOpen(false)}>
					<button onClick={handleStartEdit} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
						<PencilIcon />
						Edit
					</button>
					<button onClick={() => onDelete(todo.uuid)} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
						<TrashIcon />
						Delete
					</button>
				</div>
			)}
		</li>
	);
}

export const MemoTaskItem = memo(TaskItem);
