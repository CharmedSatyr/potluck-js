import { z } from "zod";
import { CustomizableEventValues } from "@/db/schema/event";

const currentDate = new Date();
const futureDate = new Date(currentDate);
futureDate.setFullYear(futureDate.getFullYear() + 1);

export const schema: z.ZodType<CustomizableEventValues> = z
	.strictObject({
		description: z.string().trim(),
		hosts: z.string().trim(),
		location: z.string().trim().min(1, { message: "Location required." }),
		name: z.string().trim().min(1, { message: "Name required." }),
		startDate: z
			.string({ message: "Date required." })
			.trim()
			.date("Date must be valid.")
			.refine(
				(val) => new Date(val) >= currentDate && new Date(val) <= futureDate,
				{ message: "Date must be within the next year." }
			),
		startTime: z.string().trim().time({ message: "Time required." }),
	})
	.required();

export type CreateEventData = z.infer<typeof schema>;
