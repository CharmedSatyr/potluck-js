"use server";

import updateEvent from "@/actions/db/update-event";
import { auth } from "@/auth";
import { formSchema } from "@/app/event/[code]/edit/submit-actions.schema";
import { revalidatePath } from "next/cache";
import { PlanEventFormState } from "@/app/start/submit-actions.schema";

export const updateEventAction = async (
	prevState: PlanEventFormState,
	formData: FormData
): Promise<PlanEventFormState> => {
	const data = Object.fromEntries(formData);

	const fields: Record<string, string> = {};
	for (const key of Object.keys(data)) {
		if (!data[key]) {
			continue;
		}

		fields[key] = String(data[key]);
	}

	if (!prevState.code) {
		return {
			...prevState,
			message: "Missing event code",
			success: false,
		};
	}

	if (Object.keys(fields).length === 0) {
		return {
			...prevState,
			message: "No changes detected",
			success: true,
		};
	}

	const parsed = formSchema.safeParse(fields);

	if (!parsed.success) {
		return {
			...prevState,
			message: "Invalid form data",
			success: false,
		};
	}

	const session = await auth();

	if (!session?.user?.id) {
		return {
			...prevState,
			message: "Not authenticated",
			success: false,
		};
	}

	const [result] = await updateEvent({
		...parsed.data,
		code: prevState.code,
		createdBy: session.user.id,
	});

	if (!result) {
		return {
			...prevState,
			message: "Failed to update event",
			success: false,
		};
	}

	revalidatePath(`/event/${result.code}`, "page");

	return {
		...prevState,
		code: result.code,
		fields: {},
		message: "Event updated",
		success: true,
	};
};
