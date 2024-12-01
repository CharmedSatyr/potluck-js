import { Event } from "@/db/schema/event";

export type EventData = Pick<
	Event,
	"name" | "startDate" | "startTime" | "hosts" | "location" | "description"
>;
