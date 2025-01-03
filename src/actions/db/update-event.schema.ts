import { z } from "zod";
import { Event, EventUserValues } from "@/@types/event";
import { code } from "@/validation/code.schema";
import { description } from "@/validation/description.schema";
import { hosts } from "@/validation/hosts.schema";
import { location } from "@/validation/location.schema";
import { startUtcMs } from "@/validation/startUtcMs.schema";
import { endUtcMs } from "@/validation/endUtcMs.schema";
import { title } from "@/validation/title.schema";

const currentDate = new Date();
const futureDate = new Date(currentDate);
futureDate.setFullYear(futureDate.getFullYear() + 1);

export const schema = z
	.strictObject({
		code,
		description: description.optional(),
		endUtcMs: endUtcMs.optional(),
		hosts: hosts.optional(),
		location: location.optional(),
		startUtcMs: startUtcMs.optional(),
		title: title.optional(),
	})
	.refine((data) => Object.values(data).length > 1, {
		message: "No changes detected",
	}) satisfies z.ZodType<
	Partial<EventUserValues> & Required<Pick<Event, "code">>
>;
