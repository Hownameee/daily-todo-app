import { redirect } from "react-router";
import { fromBinary } from "@bufbuild/protobuf";
import { HomeResponseSchema } from "../lib/gen/home_pb";

export async function AuthLoader({ request }: { request: Request }) {
	try {
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
	} catch {
		alert("Internal server error, please try again.");
	}
}

export async function AnimationLoader() {
	await new Promise((resolve) => {
		setTimeout(resolve, 150);
	});
	return null;
}
