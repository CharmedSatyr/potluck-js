import { User } from "@/db/schema/auth/user";
import { z } from "zod";

export const schema = z
	.strictObject({
		users: z.string().uuid().array().nonempty(),
	})
	.required() satisfies z.ZodType<{ users: User["id"][] }>;
