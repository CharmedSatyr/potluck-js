import { z } from "zod";
import { DateTime } from "luxon";

const now = DateTime.now().toUTC();
const oneYearFromNow = DateTime.now().toUTC().plus({ years: 1 });

export const startUtcMs = z.number().refine(
	(val) => {
		const input = DateTime.fromMillis(val);
		return input.isValid && input >= now && input <= oneYearFromNow;
	},
	{
		message: `Event start must be between ${now.toLocaleString()} and ${oneYearFromNow.toLocaleString()}`,
	}
);
