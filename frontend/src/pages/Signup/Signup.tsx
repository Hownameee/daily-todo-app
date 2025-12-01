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
		<div className="flex justify-center items-center w-full h-full p-4 font-sans">
			<div className="w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden ring-1 ring-white/5 animate-fade-in-up">
				<div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-purple-400 to-transparent opacity-70"></div>

				<h2 className="text-3xl font-bold text-white text-center mb-6 tracking-wide drop-shadow-md">Sign up</h2>

				{errorMessage && <div className="p-3 mb-5 text-center text-red-200 bg-red-900/40 border border-red-500/30 rounded-lg text-sm backdrop-blur-sm shadow-inner animate-pulse">{errorMessage}</div>}

				<form onSubmit={handleSubmit(handleSignup)} className="flex flex-col gap-5">
					<div>
						<label className="block text-slate-300 text-sm font-medium mb-2 ml-1" htmlFor="username">
							Username
						</label>
						<input
							type="text"
							id="username"
							className={`w-full p-3.5 rounded-xl bg-black/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border ${errors.username ? "border-red-500/50" : "border-slate-700/50 hover:border-slate-600"} focus:border-purple-500 transition-all duration-200 shadow-inner`}
							placeholder="Enter your name"
							{...register("username", { required: "Username is required" })}
						/>
						{errors.username && <p className="text-red-400 text-sm py-2 pl-1">{errors.username.message}</p>}
					</div>

					<div>
						<label className="block text-slate-300 text-sm font-medium mb-2 ml-1" htmlFor="password">
							Password
						</label>
						<input
							type="password"
							id="password"
							className={`w-full p-3.5 rounded-xl bg-black/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border ${errors.password ? "border-red-500/50" : "border-slate-700/50 hover:border-slate-600"} focus:border-purple-500 transition-all duration-200 shadow-inner`}
							placeholder="Create a password"
							{...register("password", { required: "Password is required" })}
						/>
						{errors.password && <p className="text-red-400 text-sm py-2 pl-1">{errors.password.message}</p>}
					</div>

					<div>
						<label className="block text-slate-300 text-sm font-medium mb-2 ml-1" htmlFor="confirmPassword">
							Confirm Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							className={`w-full p-3.5 rounded-xl bg-black/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border ${errors.confirmPassword ? "border-red-500/50" : "border-slate-700/50 hover:border-slate-600"} focus:border-purple-500 transition-all duration-200 shadow-inner`}
							placeholder="Re-enter your password"
							{...register("confirmPassword", { required: "Please confirm your password" })}
						/>
						{errors.confirmPassword && <p className="text-red-400 text-sm py-2 pl-1">{errors.confirmPassword.message}</p>}
					</div>

					<SubmitButtonFormData
						isLoading={isSubmitting}
						value="Sign up"
						className="w-full py-3.5 mt-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg shadow-purple-900/20 hover:shadow-purple-500/40 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer border border-white/10"
					/>
				</form>

				<div className="my-8 flex items-center">
					<div className="grow border-t border-slate-700/60"></div>
					<span className="mx-4 text-slate-500 text-xs uppercase tracking-widest font-bold">or</span>
					<div className="grow border-t border-slate-700/60"></div>
				</div>

				<button
					onClick={() => navigate(loginUrl)}
					className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 cursor-pointer border border-white/5 hover:border-white/20 hover:text-white">
					Login
				</button>
			</div>
		</div>
	);
}
