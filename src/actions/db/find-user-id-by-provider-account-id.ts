"use server";

import { z } from "zod";
import { schema } from "@/actions/db/find-user-id-by-provider-account-id.schema";
import db from "@/db/connection";
import { eq } from "drizzle-orm";
import { account } from "@/db/schema/auth/account";
import { User } from "@/db/schema/auth/user";

const findUserIdByProviderAccountId = async (
	data: z.infer<typeof schema>
): Promise<{ id: User["id"] }[]> => {
	try {
		return await db
			.select({ id: account.userId })
			.from(account)
			.where(eq(account.providerAccountId, data.providerAccountId));
	} catch (err) {
		console.error(err);

		return [];
	}
};

export default findUserIdByProviderAccountId;
