"use server";

import createCommitment from "@/actions/db/create-commitment";
import {
	CreateCommitmentFormState,
	DeleteCommitmentFormState,
	createCommitmentFormSchema,
} from "@/components/slot-manager/submit-actions.schema";
import { auth } from "@/auth";
import deleteCommitment from "@/actions/db/delete-commitment";
import { revalidatePath } from "next/cache";

export const createCommitmentAction = async (
	prevState: CreateCommitmentFormState,
	formData: FormData
): Promise<CreateCommitmentFormState> => {
	const description = String(formData.get("description") ?? "");
	const quantity = String(formData.get("quantity") ?? "0");

	const fields = { description, quantity };

	const parsed = createCommitmentFormSchema.safeParse(fields);

	if (!parsed.success) {
		return {
			...prevState,
			fields,
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

	const [result] = await createCommitment({
		...parsed.data,
		createdBy: session.user.id,
		slotId: prevState.slotId,
	});

	if (!result) {
		return {
			...prevState,
			fields,
			message: "Failed to create event",
			success: false,
		};
	}

	revalidatePath(prevState.path, "page");

	return {
		...prevState,
		fields: {
			description: "",
			quantity: "0",
		},
		message: "",
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
