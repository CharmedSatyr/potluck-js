import { Slot } from "@/db/schema/slot";

export type SlotData = {
	count: Slot["count"];
	id?: Slot["id"];
	item: Slot["item"];
};