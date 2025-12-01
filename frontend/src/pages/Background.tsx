import { Outlet, useNavigation } from "react-router";

export default function Background() {
	// console.log('background-re-render')

	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";

	return (
		<>
			<div className="relative h-screen w-screen overflow-hidden bg-slate-900 flex flex-col font-sans text-white">
				<div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
					<div className="absolute top-0 -left-4 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-drift"></div>
					<div className="absolute top-0 -right-4 w-[400px] h-[400px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-drift animation-delay-2000"></div>
					<div className="absolute -bottom-32 left-20 w-[600px] h-[600px] bg-pink-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-drift animation-delay-4000"></div>
					<div
						className="absolute inset-0 bg-white opacity-[0.02]"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
						}}></div>
				</div>

				<div className="absolute inset-0 backdrop-blur-[1px]"></div>

				<div
					className={`
                        relative z-10 w-full min-h-0 flex flex-col flex-1 
                        transition-all duration-500 ease-out 
                        ${isLoading ? "opacity-60 scale-[0.98] blur-sm grayscale-30" : "opacity-100 scale-100 blur-0 grayscale-0"}
                    `}>
					<Outlet />
				</div>
			</div>
		</>
	);
}
