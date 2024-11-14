import { z } from "zod";
import { User } from "@/db/schema/auth/user";

export const schema = z
	.strictObject({
		id: z.string().trim().uuid(),
	})
	.required() satisfies z.ZodType<{ id: User["id"] }>;
