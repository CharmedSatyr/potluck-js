"use server";

import createCommitment from "@/actions/db/create-commitment";
import {
	CreateCommitmentFormState,
	DeleteCommitmentFormState,
	createCommitmentFormSchema,
} from "@/app/event/[code]/(slot-manager)/submit-actions.schema";
import { auth } from "@/auth";
import deleteCommitment from "@/actions/db/delete-commitment";
import { revalidatePath } from "next/cache";

export const createCommitmentAction = async (
	prevState: CreateCommitmentFormState,
	formData: FormData
): Promise<CreateCommitmentFormState> => {
	const data = Object.fromEntries(formData);

	const fields: Record<string, string> = {};
	for (const key of Object.keys(data)) {
		fields[key] = data[key] as string;
	}

	const parsed = createCommitmentFormSchema.safeParse(fields);

	if (!parsed.success) {
		return {
			fields,
			message: "Invalid form data",
			path: prevState.path,
			slotId: prevState.slotId,
			success: false,
		};
	}

	const session = await auth();

	if (!session?.user?.id) {
		return {
			fields,
			message: "Not authenticated",
			path: prevState.path,
			slotId: prevState.slotId,
			success: false,
		};
	}

	const [result] = await createCommitment({
		...parsed.data,
		createdBy: session.user.id,
		slotId: prevState.slotId,
	});

	if (!result) {
		return {
			fields,
			message: "Failed to create event",
			path: prevState.path,
			slotId: prevState.slotId,
			success: false,
		};
	}

	revalidatePath(prevState.path, "page");

	return {
		fields,
		message: "Event created",
		path: prevState.path,
		slotId: prevState.slotId,
		success: true,
	};
};

export const deleteCommitmentAction = async (
	prevState: DeleteCommitmentFormState,
	_: FormData
): Promise<DeleteCommitmentFormState> => {
	if (!prevState.commitmentId) {
		return {
			commitmentId: prevState.commitmentId,
			message: "Missing commitment ID",
			path: prevState.path,
			success: false,
		};
	}

	const session = await auth();

	if (!session?.user?.id) {
		return {
			commitmentId: prevState.commitmentId,
			message: "Not authenticated",
			path: prevState.path,
			success: false,
		};
	}

	const [result] = await deleteCommitment({
		createdBy: session.user.id,
		id: prevState.commitmentId,
	});

	if (!result) {
		return {
			commitmentId: prevState.commitmentId,
			message: "Failed to delete commitment",
			path: prevState.path,
			success: false,
		};
	}

	revalidatePath(prevState.path, "page");

	return {
		commitmentId: prevState.commitmentId,
		message: "Commitment deleted",
		path: prevState.path,
		success: true,
	};
};