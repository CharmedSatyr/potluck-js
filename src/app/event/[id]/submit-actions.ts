import createCommitment from "@/actions/db/create-commitment";
import { revalidatePage } from "@/actions/revalidate-path";
import { CreateCommitmentFormState, formSchema } from "./submit-actions.types";
import { auth } from "@/auth";

export const createCommitmentAction = async (
	prevState: CreateCommitmentFormState,
	formData: FormData
): Promise<CreateCommitmentFormState> => {
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
			requestId: prevState.requestId,
			success: false,
		};
	}

	const session = await auth();

	if (!session?.user?.id) {
		return {
			fields,
			message: "Not authenticated",
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
			requestId: prevState.requestId,
			success: false,
		};
	}

	return {
		fields,
		message: "Event created",
		requestId: prevState.requestId,
		success: true,
	};

	/**
    reset();
    setCommitQuantity(0);

    await revalidatePage(pathName);
    */
};
