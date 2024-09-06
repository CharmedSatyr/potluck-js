"use client";

import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Event, EVENT_CODE_LENGTH } from "@/db/schema/event";

interface Props {
	findEventAction: (eventId: Event["eventCode"]) => Promise<boolean>;
}

interface FormInput {
	eventId: string;
}

const GotoEventForm = ({ findEventAction }: Props) => {
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

			const result = await findEventAction(data.eventId);

			if (!result) {
				setError("eventId", {
					type: "notFound",
					message: "A event with this code was not found",
				});
				return;
			}

			push(`/event/${data.eventId}`);
		});
	};

	return (
		<form className="form-control" onSubmit={handleSubmit(onSubmit)}>
			<input
				type="submit"
				className="btn btn-secondary mb-2 text-2xl"
				value="Find a Event"
			/>
			<input
				{...register("eventId", {
					required: `Enter a ${EVENT_CODE_LENGTH}-character event code`,
					minLength: {
						value: EVENT_CODE_LENGTH,
						message: `Code must be ${EVENT_CODE_LENGTH} alphanumeric characters`,
					},
					maxLength: {
						value: EVENT_CODE_LENGTH,
						message: `Code must be ${EVENT_CODE_LENGTH} alphanumeric characters`,
					},
					setValueAs: (id: string) => id.toUpperCase(),
				})}
				type="text"
				className="input input-bordered w-full"
				id="eventId"
				placeholder="238JK"
			/>
			<span className="text-error">{errors.eventId?.message}</span>
		</form>
	);
};

export default GotoEventForm;
