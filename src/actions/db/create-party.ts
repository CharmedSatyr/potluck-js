"use server";

import db from "@/db/connection";
import { Party, parties } from "@/db/schema/parties";

export type NewParty = Omit<
	Party,
	"createdAt" | "id" | "shortId" | "updatedAt"
>;

const createParty = async (info: NewParty): Promise<string> => {
	const result = await db.insert(parties).values(info).returning();

	return result[0].shortId;
};

export default createParty;
