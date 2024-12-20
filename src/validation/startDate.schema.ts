import { z } from "zod";

const currentDate = new Date();
const futureDate = new Date(currentDate);
futureDate.setFullYear(futureDate.getFullYear() + 1);

export const startDate = z
	.string({ message: "Date required." })
	.trim()
	.date("Date must be valid.")
	.refine(
		(val) => new Date(val) >= currentDate && new Date(val) <= futureDate,
		{ message: "Date must be within the next year." }
	);
