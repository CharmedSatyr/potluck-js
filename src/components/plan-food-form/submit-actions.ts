"use server";

import { schema } from "@/actions/db/update-slots.schema";
import updateSlots from "@/actions/db/update-slots";
import { redirect } from "next/navigation";
import { typeToFlattenedError } from "zod";

export type PlanFoodFormState = {
	code: string;
	errors?: typeToFlattenedError<unknown>; // TODO
	fields: any;
	message: string;
	success: boolean;
};

const submitSlots = async (
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
		if (
			!key.startsWith("item") &&
			!key.startsWith("count") &&
			!key.startsWith("id")
		) {
			continue;
		}

		fields[key] = String(data[key]);
	}

	const builder = new Map<
		number,
		{ course: string; count: number; id: string }
	>();

	for (const [key, value] of Object.entries(fields)) {
		const [field, i] = key.split("-");

		const index = Number(i);
		const currentEntry = builder.get(index) ?? { course: "", count: 0, id: "" };

		if (field === "count") {
			currentEntry.count = Number(value);
		}

		if (field === "item") {
			currentEntry.course = String(value);
		}

		if (field === "id") {
			currentEntry.id = String(value);
		}

		builder.set(index, currentEntry);
	}

	const slots: { course: string; count: number; id: string }[] = Array.from(
		builder.values()
	);

	const formatted = { code: prevState.code, slots };
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

	const result = await updateSlots({
		...parsed.data,
		code: prevState.code,
	});

	if (!result?.length) {
		return {
			...prevState,
			fields,
			message: "Failed to update slots. Please try again.",
			success: false,
		};
	}

	redirect(`/event/${prevState.code}`);
};

export default submitSlots;
