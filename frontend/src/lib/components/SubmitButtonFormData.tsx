import { ThreeDot } from "react-loading-indicators";

export default function SubmitButtonFormData({ value, className, isLoading }: { value: string; className: string; isLoading: boolean }) {
	return (
		<button type="submit" disabled={isLoading} className={`${className} relative`}>
			<div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isLoading ? "opacity-100" : "opacity-0"}`}>
				<ThreeDot color="white" size="small" text="" textColor="" />
			</div>

			<span className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}>{value}</span>
		</button>
	);
}
