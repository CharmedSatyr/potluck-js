"use server";

import deleteEvent from "@/actions/db/delete-event";
import findEvent from "@/actions/db/find-event";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const remove = async ({ code }: { code: string }): Promise<void> => {
	const session = await auth();

	const id = session?.user?.id;

	if (!id) {
		return;
	}

	// TODO: This should be in deleteEvent
	const [event] = await findEvent({ code });

	if (!event) {
		return;
	}

	await deleteEvent({ createdBy: id, id: event.id });

	revalidatePath("/my-events", "page");

	redirect("/");
};

export default remove;
