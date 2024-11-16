"use client";

import { useActionState, useRef } from "react";
import { createCommitmentAction } from "./submit-actions";
import { CreateCommitmentFormState } from "./submit-actions.schema";
import { usePathname } from "next/navigation";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

type Props = {
	commitmentsStillNeeded: number;
	slotId: string;
};

type CourseInputProps = {
	commitmentsStillNeeded: number;
	defaultValue: string;
};

const CountInput = ({
	commitmentsStillNeeded,
	defaultValue,
}: CourseInputProps) => {
	const countRef = useRef<HTMLInputElement>(null);

	return (
		<div className="form-control">
			<label htmlFor="quantity-input" className="label label-text">
				Quantity You&apos;ll Bring
			</label>
			<div className="join">
				<button
					className="btn join-item"
					onClick={() => {
						countRef.current?.stepDown();
					}}
					type="button"
				>
					<MinusIcon className="h-4 w-4 text-gray-900 dark:text-white" />
				</button>
				<input
					className="input join-item input-bordered max-w-20"
					defaultValue={defaultValue}
					id="quantity-input"
					inputMode="numeric"
					max={commitmentsStillNeeded}
					min="1"
					name="quantity"
					ref={countRef}
					required
					type="number"
				/>
				<button
					className="btn join-item"
					onClick={() => {
						countRef.current?.stepUp();
					}}
					type="button"
				>
					<PlusIcon className="h-4 w-4 text-gray-900 dark:text-white" />
				</button>
			</div>
		</div>
	);
};

const CreateCommitmentForm = ({ commitmentsStillNeeded, slotId }: Props) => {
	const path = usePathname();

	const [state, formAction, isPending] = useActionState<
		CreateCommitmentFormState,
		FormData
	>(createCommitmentAction, {
		fields: {
			description: "",
			quantity: "0",
		},
		message: "",
		path,
		slotId,
		success: false,
	});

	const isButtonDisabled = isPending || commitmentsStillNeeded === 0;

	return (
		<form action={formAction} className="flex w-full items-end justify-between">
			<CountInput
				commitmentsStillNeeded={commitmentsStillNeeded}
				defaultValue={state.fields.quantity}
			/>
			<input
				className="input-text input input-bordered w-1/2"
				defaultValue={state.fields.description}
				placeholder="(optional) Add a comment"
				maxLength={256}
				name="description"
				type="text"
			/>
			<button
				className="btn btn-secondary"
				disabled={isButtonDisabled}
				type="submit"
			>
				Save
			</button>
		</form>
	);
};

export default CreateCommitmentForm;
