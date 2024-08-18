"use server";

import { eq } from "drizzle-orm";
import db from "@/db/connection";
import { parties, Party } from "@/db/schema/parties";

type ServerCtx = Pick<Party, "createdBy" | "id">;

const findPartyServerCtxByShortId = async (
	shortId: string
): Promise<ServerCtx> => {
	const result = await db
		.select({ createdBy: parties.createdBy, id: parties.id })
		.from(parties)
		.where(eq(parties.shortId, shortId));

	return result[0];
};

export default findPartyServerCtxByShortId;
