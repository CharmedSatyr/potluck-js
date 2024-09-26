import { z } from "zod";
import { schema } from "@/actions/db/create-event.types";

export const formSchema = schema.omit({ createdBy: true });

export type CreateEventFormData = z.infer<typeof formSchema>;

export type CreateEventFormState = {
	code?: string;
	fields: Record<string, string>;
	issues?: string[];
	message: string;
	path: string;
	success: boolean;
};
