import { auth } from "@/auth";
import findPartyServerCtxByShortId from "@/actions/db/find-party-server-ctx-by-shortid";

const validateCtx = async (shortId: string): Promise<string> => {
	if (!shortId) {
		throw new Error("Missing shortId");
	}

	const { id, createdBy } = await findPartyServerCtxByShortId(shortId);

	const session = await auth();

	if (!session?.user?.email || session.user.email !== createdBy) {
		throw new Error("Not authenticated");
	}

	return id;
};

export default validateCtx;
