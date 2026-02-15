import { z } from "zod";

const errorMsg = "Password must be 8–100 characters long and contain lowercase, uppercase, number, and special character.";

export const signupSchema = z
	.object({
		username: z
			.string()
			.min(3, "Username must be between 3 and 20 characters.")
			.max(20, "Username must be between 3 and 20 characters.")
			.regex(/^[a-zA-Z0-9._]+$/, "Username can only contain letters, numbers, dot and underscore.")
			.refine((val) => !/^[._]/.test(val) && !/[._]$/.test(val), "Username cannot start or end with dot/underscore.")
			.refine((val) => !/(\.\.|__)/.test(val), "Username cannot contain consecutive dots or underscores.")
			.refine((val) => !/^\d+$/.test(val), "Username cannot be only digits.")
			.refine((val) => !["admin", "root", "system"].includes(val.toLowerCase()), "Username is not allowed."),

		password: z
			.string()
			.min(8, errorMsg)
			.max(100, errorMsg)
			.regex(/[a-z]/, errorMsg)
			.regex(/[A-Z]/, errorMsg)
			.regex(/[0-9]/, errorMsg)
			.regex(/[!@#$%^&*(),.?":{}|<>]/, errorMsg),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

export type SignupFormData = z.infer<typeof signupSchema>;
