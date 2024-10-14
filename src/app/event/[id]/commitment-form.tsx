"use client";

import { useActionState, useState } from "react";
import { createCommitmentAction } from "@/app/event/[id]/submit-actions";
import {
	CreateCommitmentFormData,
	CreateCommitmentFormState,
	formSchema,
} from "@/app/event/[id]/submit-actions.types";
import { Commitment } from "@/db/schema/commitment";
import CommitmentsTable from "@/app/event/[id]/commitments-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/db/schema/auth/user";
import { Request } from "@/db/schema/request";
import QuantityInput from "@/components/quantity-input";
import { usePathname } from "next/navigation";

type Props = {
	commitments: Commitment[];
	index: number;
	request: Request;
	users: Pick<User, "id" | "image" | "name">[];
};

const CommitmentForm = ({ commitments, index, request, users }: Props) => {
	const path = usePathname();
	const [commitQuantity, setCommitQuantity] = useState<number>(0);

	const [state, formAction, isPending] = useActionState<
		CreateCommitmentFormState,
		FormData
	>(createCommitmentAction, {
		fields: {},
		message: "",
		path,
		requestId: request.id,
		success: false,
	});

	const form = useForm<CreateCommitmentFormData>({
		mode: "all",
		resolver: zodResolver(formSchema),
		defaultValues: { description: "", quantity: 0, ...state.fields },
	});
	const { register } = form;

	const commitmentsStillNeeded = request.count - commitments.length;
	const isButtonDisabled =
		isPending || commitmentsStillNeeded === 0 || commitQuantity < 1;

	return (
		<form action={formAction} className="form-control w-full" noValidate>
			<h3 className="mt-0">Current Signups</h3>
			{commitments.length ? (
				<CommitmentsTable commitments={commitments} users={users} />
			) : (
				<p>None yet. Be the first!</p>
			)}

			<div className="flex w-full items-end justify-between">
				<QuantityInput
					index={index}
					labelText="Quantity You'll Bring"
					max={commitmentsStillNeeded}
					min={1}
					quantity={commitQuantity}
					setQuantity={setCommitQuantity}
				/>

				{/** QuantityInput input value isn't picked up by form.
				 * TODO: Try react-hook-form Controller on QuantityInput.
				 */}
				<input
					hidden
					type="number"
					value={commitQuantity}
					readOnly
					{...register("quantity")}
				/>

				<input
					className="input-text input input-bordered w-1/2"
					placeholder="(optional) Add a comment"
					type="text"
					{...register("description", {
						maxLength: 256,
					})}
				/>
				<input
					disabled={isButtonDisabled}
					className="btn btn-secondary"
					type="submit"
					value="Save"
				/>
			</div>
		</form>
	);
};

export default CommitmentForm;
