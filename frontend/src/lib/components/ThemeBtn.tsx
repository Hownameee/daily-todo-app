import type { Dispatch, SetStateAction } from "react";

export default function ThemeBtn({ theme, setTheme }: { theme: "light" | "dark"; setTheme: Dispatch<SetStateAction<"light" | "dark">> }) {
	return (
		<>
			<button
				onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				className={`absolute top-6 right-6 z-50 p-3 rounded-full backdrop-blur-md shadow-lg border transition-all duration-300 hover:scale-110 animate-bounce 
                            ${theme === "dark" ? "bg-white/10 border-white/20 text-yellow-300 hover:bg-white/20 shadow-yellow-500/20" : "bg-white/60 border-orange-200 text-orange-500 hover:bg-white/80 shadow-orange-500/20"}`}>
				{theme === "light" ? (
					<svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
						<path
							d="M12 3V4M12 20V21M4 12H3M21 12H20M5.636 5.636L6.343 6.343M17.657 17.657L18.364 18.364M5.636 18.364L6.343 17.657M17.657 6.343L18.364 5.636M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				) : (
					<svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
						<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				)}
			</button>
		</>
	);
}
