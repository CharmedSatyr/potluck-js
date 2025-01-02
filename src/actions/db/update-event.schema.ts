import { z } from "zod";
import { EVENT_CODE_LENGTH } from "@/constants/event-code-length";
import { Event, EventUserValues } from "@/@types/event";
import formatIsoTime from "@/utilities/format-iso-time";

const currentDate = new Date();
const futureDate = new Date(currentDate);
futureDate.setFullYear(futureDate.getFullYear() + 1);

export const schema = z.strictObject({
	code: z.string().trim().length(EVENT_CODE_LENGTH),
	description: z.string().trim().max(256).optional(),
	hosts: z.string().trim().max(256).optional(),
	location: z
		.string()
		.trim()
		.min(1, { message: "Location required." })
		.max(256)
		.optional(),
	startDate: z
		.string({ message: "Date required." })
		.trim()
		.date("Date must be valid.")
		.refine(
			(val) => new Date(val) >= currentDate && new Date(val) <= futureDate,
			{ message: "Date must be within the next year." }
		)
		.optional(),
	startTime: z
		.string()
		.transform(formatIsoTime)
		// Can't use `.time()` method with transform.
		.refine((val) => /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val), {
			message: "Time required.",
		})
		.optional(),
	title: z
		.string()
		.trim()
		.min(1, { message: "Title required." })
		.max(256)
		.optional(),
}) satisfies z.ZodType<
	Partial<EventUserValues> & Required<Pick<Event, "code">>
>;
