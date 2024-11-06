import { typeToFlattenedError, z } from "zod";
import { schema } from "@/actions/db/create-event.types";
import { EventUserValues } from "@/db/schema/event";

export const formSchema = schema.omit({ createdBy: true }).strip();

export type CreateEventFormData = z.infer<typeof formSchema>;

export type CreateEventFormState = {
	errors?: typeToFlattenedError<EventUserValues>; // TODO
	code?: string;
	fields: Record<string, string>;
	message: string;
	path: string;
	success: boolean;
};
