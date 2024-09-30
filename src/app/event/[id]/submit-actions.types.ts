import { z } from "zod";
import { schema } from "@/actions/db/create-commitment.types";

export const formSchema = schema.omit({ createdBy: true }).strip();

export type CreateCommitmentFormData = z.infer<typeof formSchema>;

export type CreateCommitmentFormState = {
	fields: Record<string, string>;
	message: string;
	requestId: string;
	success: boolean;
};
