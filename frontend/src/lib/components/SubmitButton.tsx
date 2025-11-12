import { useFormStatus } from "react-dom";
import { ThreeDot } from "react-loading-indicators";

export default function SubmitButton({ value, className }: { value: string; className: string }) {
	const { pending } = useFormStatus();

	return (
		<button type="submit" disabled={pending} className={`${className} ${pending ? "btn-loading" : "btn-normal"}`}>
			{pending ? <ThreeDot color="white" size="small" text="" textColor="" /> : value}
		</button>
	);
}
