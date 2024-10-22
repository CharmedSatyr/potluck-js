"use server";

import findEvent from "@/actions/db/find-event";
import { schema } from "@/actions/db/find-event.types";
import { GotoEventFormState } from "@/components/goto-event-form";
import { redirect } from "next/navigation";

const findEventExists = async (
	_: GotoEventFormState,
	formData: FormData
): Promise<GotoEventFormState> => {
	const data = Object.fromEntries(formData);

	const fields: Record<string, string> = {};
	for (const key of Object.keys(data)) {
		fields[key] = String(data[key]);
	}

	const parsed = schema.strip().safeParse(fields);

	if (!parsed.success) {
		return {
			code: fields.code,
			message: "Event code invalid.",
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

export default findEventExists;
