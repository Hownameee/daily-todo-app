import router from "express";
import authController from "../controllers/auth";
import parseProto from "../middlewares/parseProto";
import { LoginRequestSchema, SignupRequestSchema } from "../controllers/gen/auth_pb";
import validation from "../middlewares/validation";
import authSchema from "../schema/auth";

const authRouter = router();

authRouter.post("/login", parseProto(LoginRequestSchema), validation(authSchema), authController.handleSignin);
authRouter.post("/signup", parseProto(SignupRequestSchema), validation(authSchema), authController.handleSignup);
authRouter.get("/logout", authController.handleSignout);

export default authRouter;
