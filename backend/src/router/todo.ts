import router from "express";
import todoController from "../controllers/todo";
import requiredToken from "../middlewares/requiredToken";
import parseProto from "../middlewares/parseProto";
import validation from "../middlewares/validation";
import { todoSchema, updateTodoSchema, removeTodoSchema } from "../schema/todo";
import { AddTodoRequestSchema, RemoveTodoRequestSchema, TodoSchema } from "../controllers/gen/todo_pb";

const todoRouter = router();

todoRouter.use(requiredToken);

todoRouter.get("/", todoController.handleGetTodoList);
todoRouter.post("/", parseProto(AddTodoRequestSchema), validation(todoSchema), todoController.handleAddTodo);
todoRouter.delete("/", parseProto(RemoveTodoRequestSchema), validation(removeTodoSchema), todoController.handleRemoveTodo);
todoRouter.put("/", parseProto(TodoSchema), validation(updateTodoSchema), todoController.handleUpdateTodo);

export default todoRouter;
