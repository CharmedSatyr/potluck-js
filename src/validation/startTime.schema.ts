import { z } from "zod";
import formatIsoTime from "@/utilities/format-iso-time";

export const startTime = z
	.string()
	.transform(formatIsoTime)
	// Can't use `.time()` method with transform.
	.refine((val) => /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val), {
		message: "Time required.",
	});
