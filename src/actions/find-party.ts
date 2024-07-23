"use server";

import { eq } from "drizzle-orm";
import db from "@/db/connection";
import { Party, party } from "@/db/schema/party";

const findParty = async (shortId: any) =>
	await db.select().from(party).where(eq(party.shortId, shortId));

export default findParty;
