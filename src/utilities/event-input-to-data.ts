import { EventData, EventInput } from "@/@types/event";
import { DateTime } from "luxon";
import formatIsoTime from "@/utilities/format-iso-time";

/** Formats event input for the database. */
export const eventInputToData = (eventInput: EventInput): EventData => {
	const { description, hosts, location, timezone, title } = eventInput;

	const date = DateTime.fromFormat(eventInput.startDate, "yyyy-MM-dd", {
		zone: timezone,
	});
	const { hour, minute, second } = DateTime.fromFormat(
		formatIsoTime(eventInput.startTime),
		"HH:mm:ss"
	);

	const startDt = date
		.set({
			hour,
			minute,
			second,
		})
		.toUTC();

	return {
		description,
		endUtcMs: startDt.plus({ hours: 1 }).toMillis(),
		hosts,
		location,
		startUtcMs: startDt.toMillis(),
		title,
	};
};
