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
		<div className="form-control md:pl-2">
			<label className="label label-text pl-2" htmlFor="quantity-input">
				Quantity You&apos;ll Bring
			</label>
			<div className="join join-horizontal">
				<button
					className="btn join-item input-bordered"
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
					style={{ borderRadius: 0 }} // TODO: Join wasn't working properly
				/>
				<button
					className="btn join-item input-bordered"
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
		<form
			action={formAction}
			className="flex w-full flex-wrap items-end justify-between gap-2 md:flex-nowrap"
		>
			<div className="md:max-w-1/2 order-1 w-full md:order-2">
				<div className="input input-bordered flex w-full items-center gap-2">
					<span className="badge badge-info badge-sm md:badge-md">
						Optional
					</span>
					<input
						aria-label="item-description"
						className="text-sm"
						defaultValue={state?.fields.hosts}
						maxLength={256}
						name="description"
						placeholder="Add a description"
						type="text"
					/>
				</div>
			</div>

			<div className="order-2 md:order-1">
				<CountInput
					commitmentsStillNeeded={commitmentsStillNeeded}
					defaultValue={state.fields.quantity}
				/>
			</div>

			<button
				className="btn btn-secondary order-3 w-1/3 md:max-w-32"
				disabled={isButtonDisabled}
				type="submit"
			>
				Save
			</button>
		</form>
	);
};

export default CreateCommitmentForm;
