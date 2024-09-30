"use server";

import createEvent from "@/actions/db/create-event";
import { auth, signIn } from "@/auth";
import {
	formSchema,
	CreateEventFormState,
} from "@/app/start/create-event/submit-actions.types";

export const loginAction = async (
	prevState: CreateEventFormState,
	formData: FormData
): Promise<CreateEventFormState> => {
	const params = new URLSearchParams();
	for (const [key, val] of formData) {
		params.append(key, String(val));
	}

	params.append("source", "discord");
	await signIn("discord", {
		redirectTo: prevState.path.concat("?", params.toString()),
	});

	return prevState;
};

export const createEventAction = async (
	prevState: CreateEventFormState,
	formData: FormData
): Promise<CreateEventFormState> => {
	const data = Object.fromEntries(formData);

	const fields: Record<string, string> = {};
	for (const key of Object.keys(data)) {
		fields[key] = String(data[key]);
	}

	const parsed = formSchema.safeParse(fields);

	if (!parsed.success) {
		console.warn(
			"Invalid form data:",
			parsed.error.issues.map((issue) => issue.message)
		);

		return {
			fields,
			message: "Invalid form data",
			path: prevState.path,
			success: false,
		};
	}

	const session = await auth();

	if (!session?.user?.id) {
		return {
			fields,
			message: "Not authenticated",
			path: prevState.path,
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
			path: prevState.path,
			success: false,
		};
	}

	return {
		code: result.code,
		fields,
		message: "Event created",
		path: prevState.path,
		success: true,
	};
};
