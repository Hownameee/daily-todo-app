import { Request, Response } from "express";
import toProto from "../services/proto";
import { HomeResponseSchema } from "./gen/home_pb";
import { create } from "@bufbuild/protobuf";

const homeController = {
	handleRoot: (_: Request, res: Response) => {
		const username = res.locals.user;
		const message = toProto(HomeResponseSchema, create(HomeResponseSchema, { username: username }));
		res.ok(message);
	},
};

export default homeController;
