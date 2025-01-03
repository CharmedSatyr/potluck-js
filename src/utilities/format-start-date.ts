import { DateTime } from "luxon";

export const formatStartDate = (startUtcMs: number) => {
	return DateTime.fromMillis(startUtcMs).toLocaleString({
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};
