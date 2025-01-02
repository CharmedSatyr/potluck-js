import { z } from "zod";
import { Event } from "@/@types/event";
import { Commitment } from "@/db/schema/commitment";
import { code } from "@/validation/code.schema";

export const schema = z
	.strictObject({
		createdBy: z.string().trim().uuid(),
		code,
	})
	.required() satisfies z.ZodType<
	Pick<Commitment, "createdBy"> & Pick<Event, "code">
>;
