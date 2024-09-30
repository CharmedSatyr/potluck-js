"use server";

import updateEvent from "@/actions/db/update-event";
import { auth } from "@/auth";
import {
	formSchema,
	UpdateEventFormState,
} from "@/app/event/[id]/edit/submit-actions.types";
import { revalidatePage } from "@/actions/revalidate-path";

export const updateEventAction = async (
	prevState: UpdateEventFormState,
	formData: FormData
): Promise<UpdateEventFormState> => {
	const data = Object.fromEntries(formData);

	const fields: Record<string, string> = {};
	for (const key of Object.keys(data)) {
		if (!data[key]) {
			continue;
		}

		fields[key] = String(data[key]);
	}

	if (Object.keys(fields).length === 0) {
		return {
			code: prevState.code,
			fields,
			message: "No changes detected",
			success: true,
		};
	}

	const parsed = formSchema.safeParse(fields);

	if (!parsed.success) {
		return {
			code: prevState.code,
			fields,
			issues: parsed.error.issues.map((issue) => issue.message),
			message: "Invalid form data",
			success: false,
		};
	}

	const session = await auth();

	if (!session?.user?.id) {
		return {
			code: prevState.code,
			fields,
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
			code: prevState.code,
			fields,
			message: "Failed to update event",
			success: false,
		};
	}

	revalidatePage(`/event/${prevState.code}`);

	return {
		code: prevState.code,
		fields: {},
		message: "Event updated",
		success: true,
	};
};
