import { Outlet, useLoaderData } from "react-router";

export default function Layout() {
	const username = useLoaderData();
	return (
		<>
			<header className="flex justify-center items-center p-8">
				<div className="rounded-3xl bg-white/35 backdrop-blur-md p-4 px-6">
					<h1 className="text-4xl font-bold color text-[#295d6c] uppercase text-center">Welcome {username}</h1>
				</div>
			</header>
			<Outlet />
		</>
	);
}
