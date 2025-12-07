import { memo } from "react";

function Stars({ num }: { num: number }) {
	return (
		<>
			{[...Array(num)].map((_, i) => (
				<div
					key={i}
					className="absolute bg-white rounded-full"
					style={{ width: Math.random() * 3 + "px", height: Math.random() * 3 + "px", top: Math.random() * 100 + "%", left: Math.random() * 100 + "%", opacity: Math.random() * 0.7 + 0.3, animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out` }}></div>
			))}
		</>
	);
}

export const MemoStars = memo(Stars);
