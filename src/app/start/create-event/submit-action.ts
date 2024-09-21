"use server";

import createEvent from "@/actions/db/create-event";
import { auth } from "@/auth";
import {
	formSchema,
	CreateEventFormState,
} from "@/app/start/create-event/submit-action.types";

const submitAction = async (
	prevState: unknown,
	formData: FormData
): Promise<CreateEventFormState> => {
	const data = Object.fromEntries(formData);

	const fields: Record<string, string> = {};
	for (const key of Object.keys(data)) {
		fields[key] = data[key].toString();
	}

	const parsed = formSchema.safeParse(fields);

	if (!parsed.success) {
		return {
			fields,
			issues: parsed.error.issues.map((issue) => issue.message),
			message: "Invalid form data",
			success: false,
		};
	}

	const session = await auth();

	if (!session?.user?.id) {
		return {
			fields,
			message: "Not authenticated",
			success: false,
		};
	}

	const [result] = await createEvent({
		...parsed.data,
		createdBy: session.user.id,
	});

	if (!result) {
		return {
			fields,
			message: "Failed to create event",
			success: false,
		};
	}

	return {
		code: result.code,
		fields: {},
		message: "Event created",
		success: true,
	};
};

export default submitAction;
