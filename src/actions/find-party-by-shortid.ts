"use server";

import { eq } from "drizzle-orm";
import db from "@/db/connection";
import { parties, Party } from "@/db/schema/parties";

const findPartyByShortId = async (shortId: string): Promise<Party[]> =>
	await db.select().from(parties).where(eq(parties.shortId, shortId));

export default findPartyByShortId;
