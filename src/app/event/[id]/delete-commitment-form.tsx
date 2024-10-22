"use client";

import Form from "next/form";
import { Commitment } from "@/db/schema/commitment";
import { deleteCommitmentAction } from "./submit-actions";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { DeleteCommitmentFormState } from "./submit-actions.types";
import { usePathname } from "next/navigation";

type Props = {
	id: Commitment["id"];
};

const SubmitButton = () => {
	const { pending } = useFormStatus();

	return (
		<button className="btn btn-sm" type="submit">
			{pending ? "..." : "✕"}
		</button>
	);
};

const DeleteCommitmentForm = (props: Props) => {
	const path = usePathname();
	const [, formAction] = useActionState<DeleteCommitmentFormState, FormData>(
		deleteCommitmentAction,
		{
			commitmentId: props.id,
			message: "",
			path,
			success: false,
		}
	);

	return (
		<Form action={formAction}>
			<SubmitButton />
		</Form>
	);
};

export default DeleteCommitmentForm;
