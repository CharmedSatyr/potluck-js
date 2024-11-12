import { z } from "zod";
import { Request } from "@/db/schema/request";

export const schema = z
	.strictObject({
		id: z.string().trim().uuid(),
	})
	.required() satisfies z.ZodType<Pick<Request, "id">>;
