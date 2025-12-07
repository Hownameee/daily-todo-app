import { memo } from "react";

function ShootingStars() {
	return (
		<>
			<div className="absolute top-0 right-0 w-0.5 h-[100px] bg-linear-to-b from-white to-transparent opacity-0" style={{ animation: "shooting-star 4s infinite linear", animationDelay: "0s", right: "10%" }}></div>
			<div className="absolute top-10 right-20 w-0.5 h-20 bg-linear-to-b from-blue-200 to-transparent opacity-0" style={{ animation: "shooting-star 6s infinite linear", animationDelay: "2s", right: "30%" }}></div>
			<div className="absolute top-1/4 right-0 w-0.5 h-[120px] bg-linear-to-b from-cyan-100 to-transparent opacity-0" style={{ animation: "shooting-star 5s infinite linear", animationDelay: "4s", right: "5%" }}></div>
			<div className="absolute top-0 right-1/4 w-0.5 h-[110px] bg-linear-to-b from-purple-100 to-transparent opacity-0" style={{ animation: "shooting-star 7s infinite linear", animationDelay: "1.5s", right: "40%" }}></div>
			<div className="absolute top-1/3 right-10 w-0.5 h-[90px] bg-linear-to-b from-white to-transparent opacity-0" style={{ animation: "shooting-star 5.5s infinite linear", animationDelay: "3.5s", right: "20%" }}></div>
			<div className="absolute top-20 right-[60%] w-0.5 h-[130px] bg-linear-to-b from-cyan-50 to-transparent opacity-0" style={{ animation: "shooting-star 8s infinite linear", animationDelay: "1s", right: "60%" }}></div>
			<div className="absolute top-5 right-[80%] w-0.5 h-[70px] bg-linear-to-b from-white to-transparent opacity-0" style={{ animation: "shooting-star 6.5s infinite linear", animationDelay: "5s", right: "80%" }}></div>
			<div className="absolute top-1/2 right-[15%] w-[1.5px] h-[60px] bg-linear-to-b from-blue-100 to-transparent opacity-0" style={{ animation: "shooting-star 4.5s infinite linear", animationDelay: "2.5s", right: "15%" }}></div>
		</>
	);
}

export const MemoShootingStars = memo(ShootingStars);
