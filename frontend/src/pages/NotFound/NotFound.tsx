import { useNavigate } from "react-router";

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center w-full h-full p-4 relative z-10 font-sans">
			<div className="relative p-8 sm:p-14 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-4xl shadow-2xl flex flex-col items-center text-center max-w-lg w-full animate-bounce-in ring-1 ring-white/5 overflow-hidden">
				<div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none mix-blend-screen"></div>
				<div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none mix-blend-screen"></div>

				<div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"></div>

				<h1 className="relative text-[8rem] sm:text-[10rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-blue-500 to-purple-600 drop-shadow-[0_0_25px_rgba(59,130,246,0.4)] select-none animate-float-slow">404</h1>

				<h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-wide z-10 drop-shadow-md">Lost in the Void?</h2>
				<p className="mt-4 text-slate-300 text-base sm:text-lg max-w-xs sm:max-w-sm z-10 leading-relaxed font-light">The coordinates you seek have drifted into a cosmic black hole. Please return to base.</p>

				<button
					onClick={() => navigate("/")}
					className="cursor-pointer mt-8 group relative px-8 py-3.5 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 overflow-hidden border border-white/10">
					<div className="absolute inset-0 bg-white/30 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -translate-x-full"></div>

					<span className="relative flex items-center gap-2">
						<svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Return Home
					</span>
				</button>
			</div>
		</div>
	);
}
