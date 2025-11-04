import { Request, Response } from "express";
import { Controllers } from "../controllers";
import { create } from "@bufbuild/protobuf";
import { HomeResponseSchema } from "../gen/home_pb";
import { sendProto } from "./helper";
import { Status } from "../gen/response_pb";

Controllers.prototype.handleRoot = async function (req: Request, res: Response) {
	try {
		const username = res.locals.user;
		sendProto(res, HomeResponseSchema, create(HomeResponseSchema, { status: Status.SUCCESS, message: "", username: username }));
	} catch (err) {
		sendProto(res, HomeResponseSchema, create(HomeResponseSchema, { status: Status.FAILED, message: "Internal server error, please try again." }));
		this.logger(err, res.locals.user);
	}
};
