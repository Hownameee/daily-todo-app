import { Outlet, useLoaderData } from "react-router";

export default function Layout() {
	// console.log("layout-re-render");

	const username = useLoaderData();
	return (
		<>
			<header className="flex justify-center items-center p-4 sm:p-8 shrink-0">
				<div className="rounded-3xl bg-white/35 backdrop-blur-md p-4 px-6 max-w-lg w-full">
					<h1 className="text-3xl sm:text-4xl font-bold color text-[#295d6c] uppercase text-center truncate min-w-0">Welcome {username}</h1>
				</div>
			</header>
			<Outlet />
		</>
	);
}
