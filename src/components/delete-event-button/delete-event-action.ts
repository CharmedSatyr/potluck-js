"use server";

import deleteEvent from "@/actions/db/delete-event";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DeleteEventState } from "./delete-event-action.types";

const deleteEventAction = async (
	prevState: DeleteEventState,
	_: FormData
): Promise<DeleteEventState> => {
	const session = await auth();

	if (!session?.user?.id) {
		return { ...prevState, success: false };
	}

	const [id] = await deleteEvent({
		createdBy: session.user.id,
		code: prevState.code,
	});

	if (!id) {
		return {
			...prevState,
			success: false,
		};
	}

	revalidatePath("/my-events", "page");

	if (prevState.redirect) {
		redirect("/dashboard");
	}

	return {
		...prevState,
		success: true,
	};
};

export default deleteEventAction;
