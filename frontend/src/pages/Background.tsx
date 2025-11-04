import { Outlet } from "react-router";

export default function Background() {
	return (
		<>
			<div className="main h-screen w-screen bg-linear-to-r from-[#d4fc79] to-[#96e6a1]">
				<Outlet />
			</div>
		</>
	);
}
