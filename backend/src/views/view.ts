import path from "path";
import { Request, Response } from "express";

export class Views {
	private staticDir: string;

	constructor(pathDir: string) {
		this.staticDir = path.resolve(pathDir);
	}

	handleSPA(_: Request, res: Response) {
		res.sendFile(path.join(this.staticDir, "index.html"));
	}
}
