import { z } from "zod";

const passwordError = "Password must be 8-100 characters long and contain lowercase, uppercase, number, and special character.";

export const loginSchema = z.object({
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
		.min(8, passwordError)
		.max(100, passwordError)
		.regex(/[a-z]/, passwordError)
		.regex(/[A-Z]/, passwordError)
		.regex(/[0-9]/, passwordError)
		.regex(/[!@#$%^&*(),.?":{}|<>]/, passwordError),
});

export type LoginFormData = z.infer<typeof loginSchema>;
