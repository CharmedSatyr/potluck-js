"use server";

import { eq } from "drizzle-orm";
import db from "@/db/connection";
import { event, Event } from "@/db/schema/event";

type ServerCtx = Pick<Event, "createdBy" | "id">;

const findEventServerCtxByEventCode = async (
	eventCode: string
): Promise<ServerCtx> => {
	const result = await db
		.select({ createdBy: event.createdBy, id: event.id })
		.from(event)
		.where(eq(event.eventCode, eventCode));

	return result[0];
};

export default findEventServerCtxByEventCode;