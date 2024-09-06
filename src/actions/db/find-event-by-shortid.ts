"use server";

import { eq } from "drizzle-orm";
import db from "@/db/connection";
import { event, Event } from "@/db/schema/event";

const findEventByShortId = async (shortId: string): Promise<Event[]> =>
	await db.select().from(event).where(eq(event.shortId, shortId));

export default findEventByShortId;
