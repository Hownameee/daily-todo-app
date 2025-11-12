import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import SubmitButton from "@components/SubmitButtonThreeDot";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { SignupRequestSchema, type SignupRequest } from "src/lib/gen/auth_pb";
import { ResponseSchema, Status } from "src/lib/gen/response_pb";

export default function Signup() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirect") || "/";
	const loginUrl = redirectTo && redirectTo !== "/" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login";

	const [errorMessage, setErrorMessage] = useState<string>("");

	const handleSubmit = async (formData: FormData) => {
		const username = formData.get("username")?.toString();
		const password = formData.get("password")?.toString();
		const confirmPassword = formData.get("confirmPassword")?.toString();

		if (!username || !password || !confirmPassword) {
			return;
		}

		if (password != confirmPassword) {
			setErrorMessage("Password not match");
			return;
		}
		const signup: SignupRequest = create(SignupRequestSchema, { username: username, password: password });
		const bytes = toBinary(SignupRequestSchema, signup);

		try {
			const res = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/x-protobuf" }, body: bytes });

			const data = await res.arrayBuffer();
			const result = fromBinary(ResponseSchema, new Uint8Array(data));

			if (result.status == Status.FAILED) {
				setErrorMessage(result.message);
				return;
			}
			navigate("/", { replace: true });
		} catch {
			setErrorMessage("Cannot connect to server, please try again.");
		}
	};
	return (
		<div className="flex justify-center items-center w-full h-full">
			<div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-black/10">
				<h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Sign up</h2>

				{!(errorMessage === "") && <div className="p-3 mb-4 text-center text-red-700 bg-red-200/50 rounded-lg">{errorMessage}</div>}

				<form action={handleSubmit} className="flex flex-col gap-5">
					<div>
						<label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="username">
							Username
						</label>
						<input type="text" id="username" name="username" required className="w-full p-3 rounded-lg bg-white/20 border border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your name" />
					</div>

					<div>
						<label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="password">
							Password
						</label>
						<input type="password" id="password" name="password" required className="w-full p-3 rounded-lg bg-white/20 border border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your password" />
					</div>

					<div>
						<label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="confirmPassword">
							Confirm Password
						</label>
						<input type="password" id="confirmPassword" name="confirmPassword" required className="w-full p-3 rounded-lg bg-white/20 border border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Re-enter your password" />
					</div>

					<SubmitButton value="Sign up" className="w-full py-3 mt-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer" />
				</form>

				<div className="my-6 flex items-center">
					<div className="grow border-t border-gray-500/30"></div>
					<span className="mx-4 text-gray-700 text-sm">or</span>
					<div className="grow border-t border-gray-500/30"></div>
				</div>

				<button onClick={() => navigate(loginUrl)} className="w-full py-3 rounded-lg bg-gray-500/20 text-gray-900 font-semibold hover:bg-gray-500/30 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer">
					Login
				</button>
			</div>
		</div>
	);
}
