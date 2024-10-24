import { z } from "zod";
import { schema } from "@/actions/db/update-event.types";

export const formSchema = schema
	.omit({
		code: true,
		createdBy: true,
	})
	.strip();

export type UpdateEventFormData = z.infer<typeof formSchema>;

export type UpdateEventFormState = {
	code: string;
	fields: Record<string, string>;
	message: string;
	success: boolean;
};
