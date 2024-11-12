"use server";

import { z } from "zod";
import db from "@/db/connection";
import { schema } from "@/actions/db/update-requests.types";
import findEvent from "@/actions/db/find-event";
import { request, Request } from "@/db/schema/request";
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

const updateRequests = async (
	data: z.infer<typeof schema>
): Promise<
	{ course: Request["course"]; count: Request["count"]; id: Request["id"] }[]
> => {
	try {
		schema.parse(data);

		const [event] = await findEvent({ code: data.code });

		if (!event) {
			return [];
		}

		const values = data.requests.map((request) => ({
			...request,
			eventId: event.id,
		}));

		return await db
			.insert(request)
			.values(values)
			.onConflictDoUpdate({
				target: request.id,
				set: buildConflictUpdateColumns(request, ["course", "count"]),
			})
			.returning({
				course: request.course,
				count: request.count,
				id: request.id,
			});
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default updateRequests;
