import { event } from "@/db/schema/event";

export type Event = typeof event.$inferSelect;

export type EventInput = Pick<
	Event,
	"description" | "hosts" | "location" | "title"
> & { startDate: string; startTime: string; timezone: string };

export type EventData = Pick<
	Event,
	"description" | "endUtcMs" | "hosts" | "location" | "startUtcMs" | "title"
>;

export type EventDataWithCtx = Pick<Event, "createdBy" | "id"> & EventData;

export type EventUserValues = Pick<
	Event,
	| "createdBy"
	| "description"
	| "endUtcMs"
	| "hosts"
	| "location"
	| "startUtcMs"
	| "title"
>;
