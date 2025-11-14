import { Outlet, useNavigation } from "react-router";

export default function Background() {
	// console.log("bg-re-render");

	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";

	return (
		<>
			<div className="main h-screen w-screen bg-linear-to-r from-[#d4fc79] to-[#96e6a1] overflow-y-scroll no-scrollbar">
				<div className={`w-full h-full transition-all duration-150 ease-in-out ${isLoading ? "opacity-50 scale-[.98]" : "opacity-100 scale-100"}`}>
					<Outlet />
				</div>
			</div>
		</>
	);
}
