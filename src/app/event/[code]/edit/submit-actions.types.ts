import { typeToFlattenedError, z } from "zod";
import { schema } from "@/actions/db/update-event.types";
import { EventUserValues } from "@/db/schema/event";

export const formSchema = schema
	.omit({
		code: true,
		createdBy: true,
	})
	.strip();

export type UpdateEventFormData = z.infer<typeof formSchema>;
