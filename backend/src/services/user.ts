import UserModel from "../models/user";

const userService = {
	findAllByUsername: async function (username: string) {
		const res = await UserModel.findOne({ username: username });
		return res;
	},

	findByUsername: async function (username: string) {
		const res = await UserModel.findOne({ username }).select("username password");
		return res;
	},

	create: async function (username: string, password: string) {
		const res = await UserModel.create({ username, password, todos: [] });
		return res;
	},

	insertTodoByUsername: async function (username: string, title: string) {
		const updatedUser = await UserModel.findOneAndUpdate({ username }, { $push: { todos: { title: title, completed: false } } }, { new: true });
		if (!updatedUser) {
			return null;
		}
		return updatedUser.todos[updatedUser.todos.length - 1];
	},

	removeTodoByUsername: async function (username: string, todoId: string) {
		const res = await UserModel.updateOne({ username: username }, { $pull: { todos: { _id: todoId } } });
		return res.modifiedCount === 1;
	},

	updateTodoByUsername: async function (username: string, todoId: string, title: string, completed: boolean) {
		const res = await UserModel.updateOne({ username, "todos._id": todoId }, { $set: { "todos.$.title": title, "todos.$.completed": completed } });
		return res.matchedCount === 1;
	},
};

export default userService;
