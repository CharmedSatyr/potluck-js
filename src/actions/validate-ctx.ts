import { auth } from "@/auth";
import findEventServerCtxByEventCode from "@/actions/db/find-event-server-ctx-by-event-code";

interface Return {
	id: string;
	createdBy: string;
}

const validateCtx = async (eventCode: string): Promise<Return> => {
	if (!eventCode) {
		throw new Error("Missing eventCode");
	}

	const result = await findEventServerCtxByEventCode(eventCode);
	if (!result?.id || !result?.createdBy) {
		throw new Error("Invalid eventCode");
	}

	const { id, createdBy } = result;

	const session = await auth();

	if (!session?.user?.email || session.user.email !== createdBy) {
		throw new Error("Not authenticated");
	}

	return { id, createdBy };
};

export default validateCtx;
