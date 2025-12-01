import { redirect } from "react-router";
import { fromBinary } from "@bufbuild/protobuf";
import { HomeResponseSchema } from "../lib/gen/home_pb";

export async function AuthLoader({ request }: { request: Request }) {
	const res = await fetch("/api", { credentials: "include" });

	if (!res.ok) {
		const url = new URL(request.url);
		const redirectTo = url.pathname + url.search;
		const loginUrl = redirectTo && redirectTo !== "/" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login";
		throw redirect(loginUrl);
	}

	const data = await res.arrayBuffer();
	const result = fromBinary(HomeResponseSchema, new Uint8Array(data));
	return result.username;
}
