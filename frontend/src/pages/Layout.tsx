import { Outlet, useLoaderData } from "react-router";

export default function Layout() {
	// console.log("layout-re-render");

	const username = useLoaderData();
	return (
		<div className="flex flex-col h-full w-full">
			<header className="flex justify-center items-center p-4 sm:p-8 shrink-0 relative z-20">
				<div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl p-4 px-6 max-w-lg w-full border border-white/10 shadow-lg ring-1 ring-white/5 animate-fade-in-up">
					<h1 className="text-3xl sm:text-4xl font-bold text-white uppercase text-center truncate min-w-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
						Welcome <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-400">{username}</span>
					</h1>
				</div>
			</header>

			<div className="flex-1 min-h-0 relative z-10 w-full flex flex-col">
				<Outlet />
			</div>
		</div>
	);
}
