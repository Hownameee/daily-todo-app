import { randomBytes } from "crypto";

class Config {
	public readonly jwtSecret: string;
	public readonly PORT: number;
	public readonly MongoUri: string;

	constructor() {
		this.jwtSecret = process.env.JWTSECRET || randomBytes(64).toString("hex");
		this.PORT = Number(process.env.PORT) || 4000;
		this.MongoUri = process.env.MONGOURI ?? "mongodb://127.0.0.1:30000/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9";
	}
}

const config: Config = new Config();

export default config;
