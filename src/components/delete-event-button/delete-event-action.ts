"use server";

import deleteEvent from "@/actions/db/delete-event";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DeleteEventState } from "@/components/delete-event-button/delete-event-action.types";
import findEventCreatedBy from "@/actions/db/find-event-created-by";

const deleteEventAction = async (
	prevState: DeleteEventState,
	_: FormData
): Promise<DeleteEventState> => {
	const session = await auth();
	const [createdBy] = await findEventCreatedBy({ code: prevState.code });

	if (!session?.user?.id || session.user.id !== createdBy?.id) {
		return { ...prevState, success: false };
	}

	const [id] = await deleteEvent({
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
