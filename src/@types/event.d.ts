import { Event } from "@/db/schema/event";

export type EventData = Pick<
	Event,
	"startDate" | "startTime" | "hosts" | "location" | "description" | "title"
>;
