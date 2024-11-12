"use server";

import { z } from "zod";
import { schema } from "@/actions/db/delete-slot.schema";
import db from "@/db/connection";
import { eq } from "drizzle-orm";
import { slot, Slot } from "@/db/schema/slot";

const deleteSlot = async (
	data: z.infer<typeof schema>
): Promise<{ id: Slot["id"] }[]> => {
	try {
		schema.parse(data);

		return await db
			.delete(slot)
			.where(eq(slot.id, data.id))
			.returning({ id: slot.id });
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default deleteSlot;
