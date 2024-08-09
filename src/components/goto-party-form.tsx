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
				console.log(errors);
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

			push(`/party/${data.partyId}`);
		});
	};

	return (
		<form className="form-control" onSubmit={handleSubmit(onSubmit)}>
			<h2 className="mb-0 text-accent">Find a party</h2>
			<label className="label label-text" htmlFor="partyId">
				Enter a code for an existing party
			</label>
			<input
				{...register("partyId", {
					required: "This field is required",
					minLength: {
						value: SHORT_ID_LENGTH,
						message: `Code must be ${SHORT_ID_LENGTH} alphanumeric characters`,
					},
					maxLength: {
						value: SHORT_ID_LENGTH,
						message: `Code must be ${SHORT_ID_LENGTH} alphanumeric characters`,
					},
				})}
				type="text"
				className="input input-bordered w-full"
				id="partyId"
				placeholder="238JK"
			/>
			<span className="text-error">{errors.partyId?.message}</span>
			<input
				type="submit"
				className="btn btn-secondary mt-2 text-2xl"
				value="Find a Party"
			/>
		</form>
	);
};

export default GotoPartyForm;
