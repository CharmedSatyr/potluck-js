"use server";

import db from "@/db/connection";
import { Event } from "@/db/schema/event";

const findEvent = async (eventCode: string): Promise<Event | undefined> =>
	await db.query.event.findFirst({ with: { eventCode } });

export default findEvent;
