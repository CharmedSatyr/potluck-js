import { Event } from "@/db/schema/event";

export type EventData = Pick<
	Event,
	"description" | "hosts" | "location" | "startDate" | "startTime" | "title"
>;

export type EventDataWithCtx = Pick<Event, "createdBy" | "id"> & EventData;
