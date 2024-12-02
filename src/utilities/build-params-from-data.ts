import { EventData } from "@/@types/event";
import { SlotData } from "@/@types/slot";

export const buildParamsFromEventData = (
	eventData: EventData
): { [key: string]: string } => {
	const params: { [key: string]: string } = {};

	Object.entries(eventData).forEach(([key, value]) => {
		if (!value) {
			return;
		}

		params[key] = value;
	});

	return params;
};

export const buildParamsFromSlotData = (
	slotData: SlotData[]
): { [key: string]: string } => {
	const params: { [key: string]: string } = {};

	slotData.forEach((slot, index) => {
		if (slot.count) {
			params[`count-${index}`] = String(slot.count);
		}
		if (slot.id) {
			params[`id-${index}`] = slot.id;
		}
		if (slot.item) {
			params[`item-${index}`] = slot.item;
		}
	});

	return params;
};
