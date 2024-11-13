"use server";

import { z } from "zod";
import db from "@/db/connection";
import { schema } from "@/actions/db/update-slots.schema";
import findEvent from "@/actions/db/find-event";
import { slot, Slot } from "@/db/schema/slot";
import { getTableColumns, SQL, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

const buildConflictUpdateColumns = <
	T extends PgTable,
	Q extends keyof T["_"]["columns"],
>(
	table: T,
	columns: Q[]
) => {
	const cls = getTableColumns(table);

	return columns.reduce(
		(acc, column) => {
			const colName = cls[column].name;
			acc[column] = sql.raw(`excluded.${colName}`);

			return acc;
		},
		{} as Record<Q, SQL>
	);
};

const updateSlots = async (
	data: z.infer<typeof schema>
): Promise<
	{ course: Slot["course"]; count: Slot["count"]; id: Slot["id"] }[]
> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.code });

		if (!event) {
			return [];
		}

		const values = data.slots.map((slot) => ({
			...slot,
			eventId: event.id,
		}));

		return await db
			.insert(slot)
			.values(values)
			.onConflictDoUpdate({
				target: slot.id,
				set: buildConflictUpdateColumns(slot, ["course", "count"]),
			})
			.returning({
				course: slot.course,
				count: slot.count,
				id: slot.id,
			});
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default updateSlots;
