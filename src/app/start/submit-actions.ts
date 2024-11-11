"use server";

import createEvent from "@/actions/db/create-event";
import { auth, signIn } from "@/auth";
import {
	formSchema,
	CreateEventFormState,
} from "@/app/start/submit-actions.types";

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
		return {
			...prevState,
			fields,
			errors: parsed.error.flatten(),
			message: "Invalid form data",
			success: false,
		};
	}

	const session = await auth();

	if (!session?.user?.id) {
		return {
			...prevState,
			fields,
			message: "Not authenticated",
			success: false,
		};
	}

	const [result] = await createEvent({
		...parsed.data,
		createdBy: session.user.id,
		hosts: parsed.data.hosts.length ? parsed.data.hosts : session.user?.name!,
	});

	if (!result) {
		return {
			...prevState,
			fields,
			message: "Failed to create event",
			success: false,
		};
	}

	return {
		...prevState,
		code: result.code,
		message: "Event created",
		success: true,
	};
};
