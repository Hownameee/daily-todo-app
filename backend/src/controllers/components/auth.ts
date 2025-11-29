import { NextFunction, Request, Response } from "express";
import { create, fromBinary } from "@bufbuild/protobuf";
import { LoginRequestSchema, SignupRequestSchema } from "../gen/auth_pb";
import { ResponseSchema, Status } from "../gen/response_pb";
import { verify, hash } from "argon2";
import { Controllers } from "../controllers";
import * as helper from "./helper";
import jwt, { JwtPayload } from "jsonwebtoken";
import { MongoServerError } from "mongodb";
import { checkUserConstraint } from "./validate";

Controllers.prototype.setAuthentication = function (res: Response, username: string) {
	const token = jwt.sign({ username: username }, this.config.jwtSecret, { expiresIn: "24h" });
	res.cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 1000 * 60 * 60 * 24 * 3 });
};

Controllers.prototype.getAuthentication = function (req: Request, res: Response, next: NextFunction) {
	try {
		interface MyJwtPayLoad extends JwtPayload {
			username: string;
		}
		const payload: MyJwtPayLoad = jwt.verify(req.cookies.token, this.config.jwtSecret) as MyJwtPayLoad;
		res.locals.user = payload.username;
		res.locals.authenticated = true;
		next();
	} catch {
		res.sendStatus(403);
	}
};

Controllers.prototype.handleSignout = async function (req: Request, res: Response) {
	try {
		res.clearCookie("token");
		res.sendStatus(200);
	} catch (err) {
		res.sendStatus(500);
		this.logger(err, undefined);
	}
};

Controllers.prototype.handleSignin = async function (this: Controllers, req: Request, res: Response) {
	try {
		const data = fromBinary(LoginRequestSchema, req.body);
		if (!checkUserConstraint(res, data.username, data.password)) {
			return;
		}
		const result = await this.models.selectPasswordByUsername(data.username);
		if (result) {
			if (await verify(result, data.password)) {
				this.setAuthentication(res, data.username);
				helper.sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.SUCCESS, message: "" }));
			} else {
				helper.sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Username or password is incorrect, please try again." }));
			}
			return;
		}
		helper.sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Username or password is incorrect, please try again." }));
	} catch (err) {
		helper.sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Internal server error, please try again." }));
		this.logger(err, undefined);
	}
};

Controllers.prototype.handleSignup = async function (req: Request, res: Response) {
	try {
		const data = fromBinary(SignupRequestSchema, req.body);

		if (!checkUserConstraint(res, data.username, data.password)) {
			return;
		}
		const hashed = await hash(data.password);

		const result = await this.models.insertUser(data.username, hashed);
		if (result) {
			this.setAuthentication(res, data.username);
			helper.sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.SUCCESS, message: "" }));
			return;
		}
	} catch (err) {
		if (err instanceof MongoServerError) {
			if (err.code === 11000) {
				helper.sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Username was used, please try another one." }));
				return;
			}
		}
		helper.sendProto(res, ResponseSchema, create(ResponseSchema, { status: Status.FAILED, message: "Internal server error, please try again." }));
		this.logger(err, undefined);
	}
};
