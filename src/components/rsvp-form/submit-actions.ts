"use server";

import formSchema from "@/components/rsvp-form/submit-actions.schema";
import upsertRsvp from "@/actions/db/upsert-rsvp";
import { revalidatePath } from "next/cache";

export type RsvpFormState = {
	code: string;
	fields: { message: string };
	id: string;
	message: string;
	success: boolean;
};

const ERROR_MESSAGE: string = "There was a problem. Please try again.";

const submitAction = async (
	prevState: RsvpFormState,
	formData: FormData
): Promise<RsvpFormState> => {
	const message = String(formData.get("message"));
	const response = formData.get("response");

	const formatted = {
		code: prevState.code,
		createdBy: prevState.id,
		message,
		response,
	};
	const parsed = formSchema.safeParse(formatted);

	if (!parsed.success) {
		return {
			...prevState,
			fields: { message },
			message: ERROR_MESSAGE,
			success: false,
		};
	}

	const result = await upsertRsvp(parsed.data);

	if (!result.success) {
		return {
			...prevState,
			fields: { message },
			message: ERROR_MESSAGE,
			success: result.success,
		};
	}

	// TODO: We can probably just revalidate tag.
	revalidatePath(`/event/${prevState.code}`, "page");

	return {
		...prevState,
		fields: { message: "" },
		message: "",
		success: result.success,
	};
};

export default submitAction;