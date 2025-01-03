import { EventInput } from "@/@types/event";
import { SlotData } from "@/@types/slot";
import { DEFAULT_TIMEZONE } from "@/constants/default-timezone";

export const buildEventInputFromParams = async (
	paramsPromise: Promise<{
		[key: string]: string;
	}>
): Promise<EventInput> => {
	const eventInput: EventInput = {
		description: "",
		hosts: "",
		location: "",
		startDate: "",
		startTime: "",
		title: "",
		timezone: DEFAULT_TIMEZONE,
	};

	const params = await paramsPromise;

	Object.keys(eventInput).forEach((key) => {
		const searchValue = params[key];
		if (!searchValue) {
			return;
		}

		eventInput[key as keyof EventInput] = searchValue;
	});

	return eventInput;
};

export const buildSlotDataFromParams = async (
	paramsPromise: Promise<{
		[key: string]: string;
	}>
): Promise<SlotData[]> => {
	const params = await paramsPromise;

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
		const currentEntry = builder.get(index) ?? {
			count: 0,
			item: "",
			order: Number(i) + 1,
		};

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
