import { z } from "zod";
import { Commitment } from "@/db/schema/commitment";

export const schema = z
	.strictObject({
		createdBy: z.string().trim().uuid(),
		id: z.string().trim().uuid(),
	})
	.required() satisfies z.ZodType<Pick<Commitment, "createdBy" | "id">>;
