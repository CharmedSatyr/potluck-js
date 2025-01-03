import { z } from "zod";
import { DateTime } from "luxon";

const now = DateTime.now().toUTC();
const oneYearFromNow = DateTime.now().toUTC().plus({ years: 1 });

export const endUtcMs = z.number().refine(
	(val) => {
		const input = DateTime.fromMillis(val);
		return input.isValid && input >= now && input <= oneYearFromNow;
	},
	{
		// TODO: Check against start date.
		message: `Event end must be between ${now.toLocaleString()} and ${oneYearFromNow.toLocaleString()}`,
	}
);
