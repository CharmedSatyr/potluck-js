import { typeToFlattenedError, z } from "zod";
import { schema } from "@/actions/db/create-event.schema";
import { EventUserValues } from "@/db/schema/event";

export const formSchema = schema.omit({ createdBy: true }).strip();

export type PlanEventFormData = z.infer<typeof formSchema>;

export type PlanEventFormState = {
	code?: string;
	errors?: typeToFlattenedError<EventUserValues>;
	fields: Record<string, string>;
	message: string;
	path: string;
	success: boolean;
};
