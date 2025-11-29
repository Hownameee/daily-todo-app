import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import SubmitButtonFormData from "@components/SubmitButtonFormData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { SignupRequestSchema, type SignupRequest } from "src/lib/gen/auth_pb";
import { ResponseSchema, Status } from "src/lib/gen/response_pb";
import { signupSchema, type SignupFormData } from "src/lib/schema/SignupSchema";

export default function Signup() {
	// console.log("signup-re-render");

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirect") || "/";
	const loginUrl = redirectTo && redirectTo !== "/" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login";

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignupFormData>({ resolver: zodResolver(signupSchema), mode: "onBlur" });
	const [errorMessage, setErrorMessage] = useState<string>("");

	const handleSignup = async (data: SignupFormData) => {
		const signup: SignupRequest = create(SignupRequestSchema, { username: data.username, password: data.password });
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

				<form onSubmit={handleSubmit(handleSignup)} className="flex flex-col gap-5">
					<div>
						<label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="username">
							Username
						</label>
						<input
							type="text"
							id="username"
							required
							className={`w-full p-3 rounded-lg bg-white/20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-2 ${errors.username ? "border-red-500" : "border-transparent"} focus:border-transparent`}
							placeholder="Enter your name"
							{...register("username")}
						/>
						{errors.username && <p className="text-red-600 text-sm py-2">{errors.username.message}</p>}
					</div>

					<div>
						<label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="password">
							Password
						</label>
						<input
							type="password"
							id="password"
							required
							className={`w-full p-3 rounded-lg bg-white/20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-2 ${errors.password ? "border-red-500" : "border-transparent"} focus:border-transparent`}
							placeholder="Enter your password"
							{...register("password")}
						/>
						{errors.password && <p className="text-red-600 text-sm py-2">{errors.password.message}</p>}
					</div>

					<div>
						<label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="confirmPassword">
							Confirm Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							required
							className={`w-full p-3 rounded-lg bg-white/20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-2 ${errors.confirmPassword ? "border-red-500" : "border-transparent"} focus:border-transparent`}
							placeholder="Re-enter your password"
							{...register("confirmPassword")}
						/>
						{errors.confirmPassword && <p className="text-red-600 text-sm py-2">{errors.confirmPassword.message}</p>}
					</div>

					<SubmitButtonFormData isLoading={isSubmitting} value="Sign up" className="w-full py-3 mt-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer" />
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
