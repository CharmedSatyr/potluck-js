"use client";

import Form from "next/form";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Event, EVENT_CODE_LENGTH } from "@/db/schema/event";

type Props = {
	findEventExistsAction: (eventCode: Event["code"]) => Promise<boolean>;
};

interface FormInput {
	eventCode: string;
}

const GotoEventForm = ({ findEventExistsAction }: Props) => {
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

			const result = await findEventExistsAction(data.eventCode);

			if (!result) {
				setError("eventCode", {
					type: "notFound",
					message: "A event with this code was not found",
				});
				return;
			}

			push(`/event/${data.eventCode}`);
		});
	};

	return (
		<form className="form-control" onSubmit={handleSubmit(onSubmit)}>
			<input
				type="submit"
				className="btn btn-secondary mb-2 text-2xl"
				value="Find an Event"
			/>
			<input
				{...register("eventCode", {
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
			<span className="text-error">{errors.eventCode?.message}</span>
		</form>
	);
};

export default GotoEventForm;
