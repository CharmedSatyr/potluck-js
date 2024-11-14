"use server";

import formSchema from "@/components/rsvp-form/submit-actions.schema";
import upsertRsvp from "@/actions/db/upsert-rsvp";

export type RsvpFormState = {
	code: string;
	id: string;
	success: boolean;
};

const submitAction = async (
	prevState: RsvpFormState,
	formData: FormData
): Promise<RsvpFormState> => {
	const response = formData.get("response");

	const formatted = { code: prevState.code, createdBy: prevState.id, response };
	const parsed = formSchema.safeParse(formatted);

	if (!parsed.success) {
		return {
			...prevState,
			success: false,
		};
	}

	const result = await upsertRsvp(parsed.data);

	return {
		...prevState,
		success: result.success,
	};
};

export default submitAction;
