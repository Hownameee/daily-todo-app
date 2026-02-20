import { randomBytes } from "crypto";

class Config {
	public readonly JWT_SECRET: string;
	public readonly PORT: number;
	public readonly MONGO_URI: string;
	public readonly PROMETHEUS_TOKEN: string;

	constructor() {
		this.JWT_SECRET = process.env.JWTSECRET || randomBytes(64).toString("hex");
		this.PORT = Number(process.env.PORT) || 4000;
		this.MONGO_URI = process.env.MONGOURI ?? "mongodb://127.0.0.1:30000/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.9";
		this.PROMETHEUS_TOKEN = process.env.PROMETHEUS_TOKEN || "";
	}
}

const config: Config = new Config();

export default config;
