import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";
import { hash, verify } from "argon2";
import { Response } from "express";

interface MyJwtPayLoad extends JwtPayload {
	username: string;
}

const authService = {
	generateToken: function (username: string) {
		const token = jwt.sign({ username: username }, config.JWT_SECRET, { expiresIn: "24h" });
		return token;
	},

	validateToken: function (token: string) {
		const payload: MyJwtPayLoad = jwt.verify(token, config.JWT_SECRET) as MyJwtPayLoad;
		return payload;
	},

	hashPassword: function (password: string) {
		return hash(password);
	},

	validatePassword: function (password: string, hashPassword: string) {
		return verify(hashPassword, password);
	},

	setToken: function (res: Response, token: string) {
		return res.cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 1000 * 60 * 60 * 24 * 3 });
	},
};

export default authService;
