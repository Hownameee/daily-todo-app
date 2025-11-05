import { Collection, Db, InsertOneResult, MongoClient, ServerApiVersion, UUID } from "mongodb";
import { v7 } from "uuid";
import { Task, TaskDB, UserDB } from "./type";

const convertTask = (task: TaskDB): Task => {
	return { uuid: task.uuid.toString(), title: task.title, completed: task.completed };
};

// const convertTaskDB = (task: Task): TaskDB => {
// 	return {
// 		uuid: new UUID(task.uuid),
// 		title: task.title,
// 		completed: task.completed
// 	}
// }

export class Models {
	private db: Db;
	private client: MongoClient;

	constructor(db: Db, client: MongoClient) {
		this.db = db;
		this.client = client;
	}

	async close() {
		await this.client.close();
	}

	async insertUser(username: string, password: string): Promise<InsertOneResult> {
		const id = v7();
		const collection = this.db.collection("user");
		const res = await collection.insertOne({ uuid: new UUID(id), username: username, password: password, tasks: [] });
		return res;
	}

	async selectPasswordByUsername(username: string) {
		const collection: Collection<UserDB> = this.db.collection("user");
		const res = await collection.findOne({ username: username });
		return res?.password;
	}

	async selectTaskByUsername(username: string) {
		const collection: Collection<UserDB> = this.db.collection("user");
		const user = await collection.findOne({ username: username });
		if (!user || !user.tasks) {
			return null;
		}
		const tasksWithStrings = user.tasks.map((task) => {
			return convertTask(task);
		});

		return tasksWithStrings;
	}

	async insertTaskByUsername(username: string, title: string) {
		const collection: Collection<UserDB> = this.db.collection("user");
		const newTask: TaskDB = { uuid: new UUID(v7()), title: title, completed: false };

		const result = await collection.updateOne({ username: username }, { $push: { tasks: newTask } });

		if (result.matchedCount === 1 && result.modifiedCount === 1) {
			return convertTask(newTask);
		}

		return null;
	}

	async removeTaskByUsername(username: string, uuid: string): Promise<boolean> {
		const collection: Collection<UserDB> = this.db.collection("user");
		const res = await collection.updateOne({ username: username }, { $pull: { tasks: { uuid: new UUID(uuid) } } });

		return res.modifiedCount === 1;
	}

	async updateTaskByUsername(username: string, todo: Task): Promise<boolean> {
		const collection: Collection<UserDB> = this.db.collection("user");
		const res = await collection.updateOne({ username: username, "tasks.uuid": new UUID(todo.uuid) }, { $set: { "tasks.$.title": todo.title, "tasks.$.completed": todo.completed } });

		return res.modifiedCount === 1;
	}
}

export default async function openDB(mongoUri: string): Promise<Models> {
	const client = new MongoClient(mongoUri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } });
	await client.connect();

	const database: Db = client.db("todos");
	const collection = database.collection("user");
	await collection.createIndex({ username: 1 }, { unique: true });

	return new Models(database, client);
}
