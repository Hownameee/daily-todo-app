import path from "path";
import { Request, Response } from "express";

const staticDir: string = path.resolve("src/views/gen");

export default function handleSPA(_: Request, res: Response) {
	res.sendFile(path.join(staticDir, "index.html"));
}
