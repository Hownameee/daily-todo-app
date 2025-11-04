import { randomBytes } from "crypto";

export default class Config {
	public readonly jwtSecret: string;
	public readonly PORT: number;
	public readonly MongoUri: string;

	constructor() {
		this.jwtSecret = randomBytes(64).toString("hex");
		this.PORT = 4000;
		this.MongoUri = process.env.MONGOURI ?? "mongodb://127.0.0.1:30000/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9";
	}
}
