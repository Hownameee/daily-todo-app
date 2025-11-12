import { useFormStatus } from "react-dom";
import { ThreeDot } from "react-loading-indicators";

export default function SubmitButtonThreeDot({ value, className }: { value: string; className: string }) {
	const { pending } = useFormStatus();
	return (
		<button type="submit" disabled={pending} className={`${className} relative`}>
			<div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${pending ? "opacity-100" : "opacity-0"}`}>
				<ThreeDot color="white" size="small" text="" textColor="" />
			</div>

			<span className={`transition-opacity duration-300 ${pending ? "opacity-0" : "opacity-100"}`}>{value}</span>
		</button>
	);
}
