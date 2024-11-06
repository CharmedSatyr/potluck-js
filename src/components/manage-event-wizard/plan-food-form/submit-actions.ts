"use server";

import createRequest from "@/actions/db/create-request";
import { schema } from "@/actions/db/create-request.types";
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
			message: "Event code missing",
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

	console.log("fields:", fields);

	const requests: { course: string; count: number }[] = [];
	for (const [key, value] of Object.entries(data)) {
		const entry = { course: "", count: 0 };

		if (key.startsWith("quantity")) {
			const count = Number(value);
			if (count <= 0) {
				continue;
			}

			entry.count = count;
			continue;
		}

		entry.course = String(value);
	}

	if (requests.length === 0) {
		redirect(`/event/${prevState.code}`);
	}

	const formatted = { code: prevState.code, requests };
	const parsed = schema.safeParse(formatted);

	if (!parsed.success) {
		return {
			...prevState,
			errors: parsed.error.flatten(),
			success: false,
		};
	}

	const [id] = await createRequest({
		...parsed.data,
		code: prevState.code,
	});

	if (!id) {
		return {
			...prevState,
			message: "Failed to create request",
			success: false,
		};
	}

	redirect(`/event/${prevState.code}`);
};

export default submitRequest;
