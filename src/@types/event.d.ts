import { event } from "@/db/schema/event";

export type Event = typeof event.$inferSelect;

export type EventData = Pick<
	Event,
	"description" | "hosts" | "location" | "startDate" | "startTime" | "title"
>;

export type EventDataWithCtx = Pick<Event, "createdBy" | "id"> & EventData;

export type EventUserValues = Pick<
	Event,
	| "createdBy"
	| "description"
	| "hosts"
	| "location"
	| "startDate"
	| "startTime"
	| "title"
>;
