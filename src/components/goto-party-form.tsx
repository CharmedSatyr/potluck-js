"use client";

import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Party, SHORT_ID_LENGTH } from "@/db/schema/parties";

interface Props {
	findPartyAction: (partyId: Party["shortId"]) => Promise<boolean>;
}

interface FormInput {
	partyId: string;
}

const GotoPartyForm = ({ findPartyAction }: Props) => {
	const { push } = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<FormInput>();

	const onSubmit = async (data: FormInput) => {
		startTransition(async () => {
			if (Object.keys(errors).length > 0) {
				return;
			}

			const result = await findPartyAction(data.partyId);

			if (!result) {
				setError("partyId", {
					type: "notFound",
					message: "A party with this code was not found",
				});
				return;
			}

			push(`/event/${data.partyId}`);
		});
	};

	return (
		<form className="form-control" onSubmit={handleSubmit(onSubmit)}>
			<input
				type="submit"
				className="btn btn-secondary mb-2 text-2xl"
				value="Find a Party"
			/>
			<input
				{...register("partyId", {
					required: `Enter a ${SHORT_ID_LENGTH}-character party code`,
					minLength: {
						value: SHORT_ID_LENGTH,
						message: `Code must be ${SHORT_ID_LENGTH} alphanumeric characters`,
					},
					maxLength: {
						value: SHORT_ID_LENGTH,
						message: `Code must be ${SHORT_ID_LENGTH} alphanumeric characters`,
					},
					setValueAs: (id: string) => id.toUpperCase(),
				})}
				type="text"
				className="input input-bordered w-full"
				id="partyId"
				placeholder="238JK"
			/>
			<span className="text-error">{errors.partyId?.message}</span>
		</form>
	);
};

export default GotoPartyForm;
