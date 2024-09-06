"use server";

import { eq } from "drizzle-orm";
import db from "@/db/connection";
import { event, Event } from "@/db/schema/event";

const findEventByEventCode = async (eventCode: string): Promise<Event[]> =>
	await db.select().from(event).where(eq(event.eventCode, eventCode));

export default findEventByEventCode;
