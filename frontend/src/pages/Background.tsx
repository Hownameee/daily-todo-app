import { useEffect, useState } from "react";
import { Outlet, useNavigation } from "react-router";

export default function Background() {
	// console.log("background-re-render")

	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";

	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			requestAnimationFrame(() => {
				setMousePosition({ x: event.clientX, y: event.clientY });
			});
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return (
		<>
			<div className="relative h-screen w-screen overflow-hidden bg-[#0a0a0f] flex flex-col font-sans text-white">
				<div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
					<div className="absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen transition-transform duration-75 ease-out will-change-transform z-0" style={{ left: -300, top: -300, transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}></div>
					<div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-700/30 rounded-full mix-blend-screen filter blur-[120px] animate-drift"></div>
					<div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-drift-slow"></div>
					<div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[40vw] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[130px] animate-drift-fast"></div>
					<div className="absolute top-0 right-0 w-0.5 h-[100px] bg-linear-to-b from-white to-transparent opacity-0" style={{ animation: "shooting-star 4s infinite linear", animationDelay: "0s", right: "10%" }}></div>
					<div className="absolute top-10 right-20 w-0.5 h-20 bg-linear-to-b from-blue-200 to-transparent opacity-0" style={{ animation: "shooting-star 6s infinite linear", animationDelay: "2s", right: "30%" }}></div>
					<div className="absolute top-1/4 right-0 w-0.5 h-[120px] bg-linear-to-b from-cyan-100 to-transparent opacity-0" style={{ animation: "shooting-star 5s infinite linear", animationDelay: "4s", right: "5%" }}></div>
					<div className="absolute top-0 right-1/4 w-0.5 h-[110px] bg-linear-to-b from-purple-100 to-transparent opacity-0" style={{ animation: "shooting-star 7s infinite linear", animationDelay: "1.5s", right: "40%" }}></div>
					<div className="absolute top-1/3 right-10 w-0.5 h-[90px] bg-linear-to-b from-white to-transparent opacity-0" style={{ animation: "shooting-star 5.5s infinite linear", animationDelay: "3.5s", right: "20%" }}></div>
					<div className="absolute top-20 right-[60%] w-0.5 h-[130px] bg-linear-to-b from-cyan-50 to-transparent opacity-0" style={{ animation: "shooting-star 8s infinite linear", animationDelay: "1s", right: "60%" }}></div>
					<div className="absolute top-5 right-[80%] w-0.5 h-[70px] bg-linear-to-b from-white to-transparent opacity-0" style={{ animation: "shooting-star 6.5s infinite linear", animationDelay: "5s", right: "80%" }}></div>
					<div className="absolute top-1/2 right-[15%] w-[1.5px] h-[60px] bg-linear-to-b from-blue-100 to-transparent opacity-0" style={{ animation: "shooting-star 4.5s infinite linear", animationDelay: "2.5s", right: "15%" }}></div>
					<div
						className="absolute inset-0 bg-white opacity-[0.03]"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
						}}></div>
				</div>
				<div className="absolute inset-0 backdrop-blur-[0px]"></div>
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
