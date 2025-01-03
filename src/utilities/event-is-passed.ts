import { DateTime } from "luxon";

const eventIsPassed = (startUtcMs: number) => {
	return DateTime.fromMillis(startUtcMs) > DateTime.now();
};

export default eventIsPassed;
