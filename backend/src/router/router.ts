import express from "express";
import { Controllers } from "../controllers/controllers";
import { Views } from "../views/view";
import cookieParser from "cookie-parser";

export default function serveRoute(controller: Controllers, view: Views) {
	const router = express();

	router.use(express.raw({ type: "application/x-protobuf" }));
	router.use(cookieParser());
	router.use(express.static("src/views/gen"));

	router.get("/", (req, res) => view.handleSPA(req, res));
	router.get("/login", (req, res) => view.handleSPA(req, res));
	router.get("/signup", (req, res) => view.handleSPA(req, res));

	router.post("/api/login", (req, res) => controller.handleSignin(req, res));
	router.post("/api/signup", (req, res) => controller.handleSignup(req, res));
	router.get("/api/logout", (req, res) => controller.handleSignout(req, res));
	router.get(
		"/api",
		(req, res, next) => controller.getAuthentication(req, res, next),
		(req, res) => controller.handleRoot(req, res),
	);

	router.get(
		"/api/todos",
		(req, res, next) => controller.getAuthentication(req, res, next),
		(req, res) => controller.handleGetTaskList(req, res),
	);

	router.post(
		"/api/todos",
		(req, res, next) => controller.getAuthentication(req, res, next),
		(req, res) => controller.handleAddTask(req, res),
	);

	router.delete(
		"/api/todos",
		(req, res, next) => controller.getAuthentication(req, res, next),
		(req, res) => controller.handleRemoveTask(req, res),
	);

	router.put(
		"/api/todos",
		(req, res, next) => controller.getAuthentication(req, res, next),
		(req, res) => controller.handleUpdateTask(req, res),
	);

	return router;
}
