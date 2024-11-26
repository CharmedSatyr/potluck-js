"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Form from "next/form";
import { usePathname } from "next/navigation";
import { Commitment } from "@/db/schema/commitment";
import { deleteCommitmentAction } from "@/components/slot-manager/submit-actions";
import { DeleteCommitmentFormState } from "@/components/slot-manager/submit-actions.schema";
import LoadingIndicator from "../loading-indicator";

type Props = {
	id: Commitment["id"];
};

const SubmitButton = () => {
	const { pending } = useFormStatus();

	return (
		<button className="btn btn-circle btn-xs md:btn-sm" type="submit">
			{pending ? <LoadingIndicator size={4} /> : "✕"}
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
		<Form action={formAction} className="w-fit">
			<SubmitButton />
		</Form>
	);
};

export default DeleteCommitmentForm;
