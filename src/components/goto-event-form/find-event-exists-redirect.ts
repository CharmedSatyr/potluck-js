"use server";

import findEvent from "@/actions/db/find-event";
import { schema } from "@/actions/db/find-event.schema";
import { GotoEventFormState } from "@/components/goto-event-form";
import { redirect } from "next/navigation";

const findEventExistsRedirect = async (
	_: GotoEventFormState,
	formData: FormData
): Promise<GotoEventFormState> => {
	const code = String(formData.get("code"));

	const fields = { code: code.toUpperCase() };
	const parsed = schema.safeParse(fields);

	if (!parsed.success) {
		return {
			code: fields.code,
			message: "Event code not found.",
			success: false,
		};
	}

	const [event] = await findEvent({ code: parsed.data.code });

	if (!event) {
		return {
			code: fields.code,
			message: "Event code not found.",
			success: false,
		};
	}

	redirect(`/event/${fields.code}`);
};

export default findEventExistsRedirect;
