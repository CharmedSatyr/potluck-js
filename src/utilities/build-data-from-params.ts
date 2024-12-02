import { EventData } from "@/@types/event";
import { SlotData } from "@/@types/slot";
import { DEV } from "@/utilities/current-env";

const testVals: EventData = {
	description: "A beautiful walk in the park.",
	hosts: "Winston Churchill and Elon Musk",
	location: DEV ? "123 Main Street" : "",
	name: DEV ? "Test Event" : "",
	startDate: DEV ? "2025-01-09" : "",
	startTime: DEV ? "12:00" : "",
};

export const buildEventDataFromParams = (params: {
	[key: string]: string;
}): EventData => {
	const values: EventData = {
		description: "",
		hosts: "",
		location: "",
		name: "",
		startDate: "",
		startTime: "",
	};

	for (const key in Object.keys(values)) {
		const searchValue = params[key];
		if (!searchValue) {
			continue;
		}

		values[key as keyof EventData] = searchValue;
	}

	if (DEV) {
		return testVals;
	}

	return values;
};

export const buildSlotDataFromParams = (params: {
	[key: string]: string;
}): SlotData[] => {
	const fields: Record<string, string> = {};

	for (const key of Object.keys(params)) {
		if (
			!key.startsWith("count") &&
			!key.startsWith("id") &&
			!key.startsWith("item")
		) {
			continue;
		}

		fields[key] = params[key];
	}

	const builder = new Map<number, SlotData>();

	for (const [key, value] of Object.entries(fields)) {
		const [field, i] = key.split("-");

		const index = Number(i);
		const currentEntry = builder.get(index) ?? { count: 0, item: "" };

		if (field === "count") {
			currentEntry.count = Number(value);
		}

		if (field === "id") {
			currentEntry.id = value;
		}

		if (field === "item") {
			currentEntry.item = value;
		}

		builder.set(index, currentEntry);
	}

	return Array.from(builder.values()).filter((slot) => slot.count && slot.item);
};
