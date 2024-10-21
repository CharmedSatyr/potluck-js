"use client";

import { Commitment } from "@/db/schema/commitment";
import { deleteCommitmentAction } from "./submit-actions";
import { useFormStatus } from "react-dom";

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
	return (
		<form action={async () => await deleteCommitmentAction(props.id)}>
			<SubmitButton />
		</form>
	);
};

export default DeleteCommitmentForm;
