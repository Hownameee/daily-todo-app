import { MemoShootingStars } from "@components/ShootingStars";
import { MemoStars } from "@components/Stars";
import ThemeBtn from "@components/ThemeBtn";
import { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useNavigation } from "react-router";
import { ThemeContext } from "src/lib/Context/ThemeContext";

export default function Background() {
	// console.log("background-re-render")

	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";
	const [numberStar, setNumberStar] = useState<number>(200);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [theme, setTheme] = useState<"light" | "dark">("dark");

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			requestAnimationFrame(() => {
				setMousePosition({ x: event.clientX, y: event.clientY });
			});
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	useLayoutEffect(() => {
		const handleResize = () => {
			const w = window.innerWidth;
			if (w < 480) {
				setNumberStar(50);
			} else if (w < 768) {
				setNumberStar(125);
			} else {
				setNumberStar(300);
			}
		};

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<>
			<ThemeContext.Provider value={theme}>
				<div className="relative h-screen w-screen overflow-hidden bg-[#0a0a0f] flex flex-col font-sans text-white">
					<ThemeBtn setTheme={setTheme} theme={theme} />
					<div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
						<div
							className="absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen transition-transform duration-75 ease-out will-change-transform z-0"
							style={{ left: -300, top: -300, transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}></div>
						<div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-700/30 rounded-full mix-blend-screen filter blur-[120px] animate-drift"></div>
						<div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-drift-slow"></div>
						<div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[40vw] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[130px] animate-drift-fast"></div>
						<div
							className="absolute inset-0 bg-white opacity-[0.03]"
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
							}}></div>
						<MemoShootingStars />
						<MemoStars num={numberStar} />
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
			</ThemeContext.Provider>
		</>
	);
}
