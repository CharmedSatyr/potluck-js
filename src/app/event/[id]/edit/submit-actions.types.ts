import { z } from "zod";
import { schema } from "@/actions/db/update-event.types";

export const formSchema = schema.omit({
	code: true,
	createdBy: true,
});

export type UpdateEventFormData = z.infer<typeof formSchema>;

export type UpdateEventFormState = {
	code: string;
	fields: Record<string, string>;
	issues?: string[];
	message: string;
	success: boolean;
};
