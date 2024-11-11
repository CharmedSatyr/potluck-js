"use server";

import createRequests from "@/actions/db/create-requests";
import { schema } from "@/actions/db/create-requests.types";
import { redirect } from "next/navigation";
import { typeToFlattenedError } from "zod";

export type PlanFoodFormState = {
	code: string;
	errors?: typeToFlattenedError<unknown>; // TODO
	fields: any;
	message: string;
	success: boolean;
};

const submitRequest = async (
	prevState: PlanFoodFormState,
	formData: FormData
): Promise<PlanFoodFormState> => {
	if (!prevState.code) {
		return {
			...prevState,
			message: "Event code missing. Please refresh the page and try again.",
			success: false,
		};
	}

	const data = Object.fromEntries(formData);

	const fields: Record<string, string> = {};
	for (const key of Object.keys(data)) {
		if (!key.startsWith("name") && !key.startsWith("quantity")) {
			continue;
		}

		fields[key] = String(data[key]);
	}

	const builder = new Map<number, { course: string; count: number }>();

	for (const [key, value] of Object.entries(fields)) {
		const [field, i] = key.split("-");

		const index = Number(i);
		const currentEntry = builder.get(index) ?? { course: "", count: 0 };

		if (field === "quantity") {
			currentEntry.count = Number(value);
		}

		if (field === "name") {
			currentEntry.course = String(value);
		}

		builder.set(index, currentEntry);
	}

	const requests: { course: string; count: number }[] = Array.from(
		builder.values()
	);

	const formatted = { code: prevState.code, requests };
	const parsed = schema.safeParse(formatted);

	if (!parsed.success) {
		return {
			...prevState,
			fields,
			errors: parsed.error.flatten(),
			message: "There was a problem. Verify entries and try again.",
			success: false,
		};
	}

	const [id] = await createRequests({
		...parsed.data,
		code: prevState.code,
	});

	if (!id) {
		return {
			...prevState,
			fields,
			message: "Failed to create request. Please try again.",
			success: false,
		};
	}

	redirect(`/event/${prevState.code}`);
};

export default submitRequest;
