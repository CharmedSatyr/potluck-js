import { z } from "zod";
import { CustomizableEventValues } from "@/db/schema/event";
import formatIsoTime from "@/utilities/format-iso-time";

const currentDate = new Date();
const futureDate = new Date(currentDate);
futureDate.setFullYear(futureDate.getFullYear() + 1);

export const schema: z.ZodType<CustomizableEventValues> = z
	.strictObject({
		description: z.string().trim().max(256),
		hosts: z.string().trim().max(256),
		location: z
			.string()
			.trim()
			.min(1, { message: "Location required." })
			.max(256),
		name: z.string().trim().min(1, { message: "Name required." }).max(256),
		startDate: z
			.string({ message: "Date required." })
			.trim()
			.date("Date must be valid.")
			.refine(
				(val) => new Date(val) >= currentDate && new Date(val) <= futureDate,
				{ message: "Date must be within the next year." }
			),
		startTime: z
			.string()
			.transform(formatIsoTime)
			.refine((val) => /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val), {
				message: "Time required.",
			}),
	})
	.required();

export type CreateEventData = z.infer<typeof schema>;
