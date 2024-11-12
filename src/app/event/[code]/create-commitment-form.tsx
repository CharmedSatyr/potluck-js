"use client";

import Form from "next/form";
import { useActionState, useEffect, useState } from "react";
import { createCommitmentAction } from "@/app/event/[code]/submit-actions";
import {
	CreateCommitmentFormData,
	CreateCommitmentFormState,
	createCommitmentFormSchema,
} from "@/app/event/[code]/submit-actions.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QuantityInput from "@/components/quantity-input";
import { usePathname } from "next/navigation";

type Props = {
	commitmentsStillNeeded: number;
	index: number;
	slotId: string;
};

const CreateCommitmentForm = ({
	commitmentsStillNeeded,
	index,
	slotId,
}: Props) => {
	const path = usePathname();
	const [commitQuantity, setCommitQuantity] = useState<number>(0);

	const [state, formAction, isPending] = useActionState<
		CreateCommitmentFormState,
		FormData
	>(createCommitmentAction, {
		fields: {},
		message: "",
		path,
		slotId,
		success: false,
	});

	useEffect(() => {
		if (!state.success) {
			return;
		}

		setCommitQuantity(0);
	}, [state.success]);

	const form = useForm<CreateCommitmentFormData>({
		mode: "all",
		resolver: zodResolver(createCommitmentFormSchema),
		defaultValues: { description: "", quantity: 0, ...state.fields },
	});
	const { register } = form;

	const isButtonDisabled =
		isPending || commitmentsStillNeeded === 0 || commitQuantity < 1;

	return (
		<Form action={formAction} className="form-control w-full" noValidate>
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
		</Form>
	);
};

export default CreateCommitmentForm;
