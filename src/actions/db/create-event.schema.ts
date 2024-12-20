import { z } from "zod";
import { EventUserValues } from "@/db/schema/event";
import { createdBy } from "@/validation/createdBy.schema";
import { location } from "@/validation/location.schema";
import { title } from "@/validation/title.schema";
import { description } from "@/validation/description.schema";
import { hosts } from "@/validation/hosts.schema";
import { startDate } from "@/validation/startDate.schema";
import { startTime } from "@/validation/startTime.schema";

export const schema = z
	.strictObject({
		createdBy,
		description,
		hosts,
		location,
		startDate,
		startTime,
		title,
	})
	.required() satisfies z.ZodType<EventUserValues>;
