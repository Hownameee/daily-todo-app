import { NextFunction, Request, Response } from "express";
import { LoginRequest, SignupRequest } from "./gen/auth_pb";
import userService from "../services/user";
import authService from "../services/auth";

const authController = {
	handleSignout: async function (req: Request, res: Response) {
		res.clearCookie("token");
		res.ok(null);
	},

	handleSignin: async function (req: Request, res: Response) {
		const data: LoginRequest = req.body;
		const user = await userService.findByUsername(data.username);
		if (user) {
			const valid = await authService.validatePassword(data.password, user.password);
			if (valid) {
				const token = authService.generateToken(user.username);
				authService.setToken(res, token);
				return res.ok(null);
			}
		}
		return res.notFound();
	},

	handleSignup: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data: SignupRequest = req.body;
			const hashPassword = await authService.hashPassword(data.password);
			await userService.create(data.username, hashPassword);
			return res.created(null);
		} catch (error) {
			return next(error);
		}
	},
};

export default authController;
