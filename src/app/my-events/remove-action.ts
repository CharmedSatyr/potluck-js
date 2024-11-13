"use server";

import deleteEvent from "@/actions/db/delete-event";
import findEvent from "@/actions/db/find-event";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const remove = async ({ code }: { code: string }): Promise<void> => {
	const session = await auth();

	const id = session?.user?.id;

	if (!id) {
		return;
	}

	const [event] = await findEvent({ code });

	if (!event) {
		return;
	}

	await deleteEvent({ createdBy: id, id: event.id });

	revalidatePath("/my-events", "page");
};

export default remove;
