"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Form from "next/form";
import { usePathname } from "next/navigation";
import { Commitment } from "@/db/schema/commitment";
import { deleteCommitmentAction } from "@/app/event/[code]/submit-actions";
import { DeleteCommitmentFormState } from "@/app/event/[code]/submit-actions.types";

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
