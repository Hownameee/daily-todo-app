import express from "express";
import { connectDB } from "./db/db";
import handleSPA from "./views/view";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import rootRouter from "./router/home";
import authRouter from "./router/auth";
import todoRouter from "./router/todo";
import restResponse from "./middlewares/restResponse";
import errorHandler from "./middlewares/errorHandler";

connectDB();

const app = express();
const limiter = rateLimit({ windowMs: 2 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false, message: "Too many requests, please try again after 2 minutes" });

app.use(limiter);
app.use(compression());
app.use(express.raw({ type: "application/x-protobuf" }));
app.use(cookieParser());
app.use(express.static("src/views/gen"));
app.use(restResponse);

const apiRouter = express.Router();

apiRouter.use(rootRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/todo", todoRouter);

app.use("/api", apiRouter);

app.get("/{*splat}", (req, res) => {
	handleSPA(req, res);
});

app.use(errorHandler);

export default app;
