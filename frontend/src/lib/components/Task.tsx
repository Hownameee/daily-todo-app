import { memo, useState } from "react";
import type { Task } from "../gen/todos_pb";
import SubmitButtonSpinner from "./SubmitButtonSpinner";
import { CheckCircleIcon, MoreVerticalIcon } from "./ReactIcons";
import { PencilIcon, TrashIcon } from "@assets/index";
type TodoItemProps = { todo: Task; index: number; onDelete: (uuid: string) => Promise<void>; onToggle: (todo: Task) => Promise<void>; onUpdate: (todo: Task, newTitle: string) => Promise<void> };

function TaskItem({ todo, index, onDelete, onToggle, onUpdate }: TodoItemProps) {
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
				<form action={handleSaveChanges} className="flex gap-2 p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md shadow-inner transition-all animate-fade-in-up">
					<input
						type="text"
						value={editingTodoTitle}
						onChange={(e) => setEditingTodoTitle(e.target.value)}
						className="grow p-2 rounded-lg bg-black/40 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
						autoFocus
					/>
					<SubmitButtonSpinner value="Save" className="p-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/20 transition-all cursor-pointer" />
					<button type="button" onClick={handleCancelEdit} className="p-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-all border border-white/5">
						Cancel
					</button>
				</form>
			) : (
				<div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-xl group transition-all duration-300">
					<span className={`grow text-slate-200 truncate transition-opacity flex items-center ${todo.completed ? "text-slate-500 opacity-50 line-through decoration-slate-600" : ""}`}>
						<span className={`font-mono font-bold mr-3 text-sm px-2 py-0.5 rounded ${todo.completed ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>{"T" + (index + 1)}</span>
						<span title={todo.title}>{todo.title}</span>
					</span>

					<button onClick={() => onToggle(todo)} className={`shrink-0 p-1.5 rounded-full transition-all duration-200 ease-out active:scale-90 ${todo.completed ? "text-emerald-400 bg-emerald-500/10" : "text-slate-500 hover:text-cyan-400 hover:bg-white/5"}`}>
						<CheckCircleIcon completed={todo.completed} />
					</button>

					<button onClick={toggleOptions} className="p-2 rounded-full text-slate-500 hover:bg-white/10 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
						<MoreVerticalIcon />
					</button>
				</div>
			)}

			{isMenuOpen && (
				<div className="absolute right-0 top-[calc(100%+5px)] z-50 w-40 bg-slate-900 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl ring-1 ring-black/50 overflow-hidden animate-fade-in-up origin-top-right" onMouseLeave={() => setIsMenuOpen(false)}>
					<button onClick={handleStartEdit} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5">
						<PencilIcon />
						Edit Task
					</button>
					<button onClick={() => onDelete(todo.uuid)} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors">
						<TrashIcon />
						Delete Task
					</button>
				</div>
			)}
		</li>
	);
}

export const MemoTaskItem = memo(TaskItem);
