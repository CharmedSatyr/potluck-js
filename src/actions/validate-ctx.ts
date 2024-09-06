import { auth } from "@/auth";
import findEventServerCtxByShortId from "@/actions/db/find-event-server-ctx-by-shortid";

interface Return {
	id: string;
	createdBy: string;
}

const validateCtx = async (shortId: string): Promise<Return> => {
	if (!shortId) {
		throw new Error("Missing shortId");
	}

	const result = await findEventServerCtxByShortId(shortId);
	if (!result?.id || !result?.createdBy) {
		throw new Error("Invalid shortId");
	}

	const { id, createdBy } = result;

	const session = await auth();

	if (!session?.user?.email || session.user.email !== createdBy) {
		throw new Error("Not authenticated");
	}

	return { id, createdBy };
};

export default validateCtx;
