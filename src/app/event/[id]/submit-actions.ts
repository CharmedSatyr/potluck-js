"use server";

import createCommitment from "@/actions/db/create-commitment";
import { CreateCommitmentFormState, formSchema } from "./submit-actions.types";
import { auth } from "@/auth";
import { revalidatePage } from "@/actions/revalidate-path";

export const createCommitmentAction = async (
	prevState: CreateCommitmentFormState,
	formData: FormData
): Promise<CreateCommitmentFormState> => {
	const data = Object.fromEntries(formData);

	const fields: Record<string, string> = {};
	for (const key of Object.keys(data)) {
		fields[key] = data[key] as string;
	}

	const parsed = formSchema.safeParse(fields);

	if (!parsed.success) {
		console.warn(
			"Invalid form data:",
			fields,
			parsed.error.issues.map((issue) => issue.message)
		);

		return {
			fields,
			message: "Invalid form data",
			path: prevState.path,
			requestId: prevState.requestId,
			success: false,
		};
	}

	const session = await auth();

	if (!session?.user?.id) {
		return {
			fields,
			message: "Not authenticated",
			path: prevState.path,
			requestId: prevState.requestId,
			success: false,
		};
	}

	const [result] = await createCommitment({
		...parsed.data,
		createdBy: session.user.id,
		requestId: prevState.requestId,
	});

	if (!result) {
		return {
			fields,
			message: "Failed to create event",
			path: prevState.path,
			requestId: prevState.requestId,
			success: false,
		};
	}

	await revalidatePage(prevState.path);

	return {
		fields,
		message: "Event created",
		path: prevState.path,
		requestId: prevState.requestId,
		success: true,
	};
};
