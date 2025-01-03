import { z } from "zod";
import { EventUserValues } from "@/@types/event";
import { createdBy } from "@/validation/createdBy.schema";
import { location } from "@/validation/location.schema";
import { title } from "@/validation/title.schema";
import { description } from "@/validation/description.schema";
import { hosts } from "@/validation/hosts.schema";
import { startUtcMs } from "@/validation/startUtcMs.schema";
import { endUtcMs } from "@/validation/endUtcMs.schema";

export const schema = z
	.strictObject({
		createdBy,
		description,
		endUtcMs,
		hosts,
		location,
		startUtcMs,
		title,
	})
	.required() satisfies z.ZodType<EventUserValues>;
