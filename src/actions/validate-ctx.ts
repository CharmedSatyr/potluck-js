import { auth } from "@/auth";
import findPartyServerCtxByShortId from "@/actions/db/find-party-server-ctx-by-shortid";

interface Return {
	id: string;
	createdBy: string;
}

const validateCtx = async (shortId: string): Promise<Return> => {
	if (!shortId) {
		throw new Error("Missing shortId");
	}

	const { id, createdBy } = await findPartyServerCtxByShortId(shortId);

	const session = await auth();

	if (!session?.user?.email || session.user.email !== createdBy) {
		throw new Error("Not authenticated");
	}

	return { id, createdBy };
};

export default validateCtx;
