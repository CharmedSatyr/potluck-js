"use client";

import { NewParty } from "@/actions/db/create-party";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { FormInput } from "@/app/create-party/page";

const StepTwo = () => {
	const { push } = useRouter();
	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useFormContext<FormInput>();

	const submit = (_: Partial<NewParty>) => {
		push(`/create-party/step-three`);
	};

	return (
		<>
			<form onSubmit={handleSubmit(submit)}>
				<div className="my-2">
					<label htmlFor="location" className="label label-text">
						Location
					</label>
					<input
						className="input input-bordered w-full"
						id="location"
						type="text"
						{...register("location", {
							required: "This field is required",
							maxLength: 256,
						})}
					/>
					<span className="error">{errors.location?.message}</span>
				</div>

				<input
					type="submit"
					className="btn btn-primary my-8 w-full"
					value="Next"
				/>
			</form>

			<ul className="steps w-full">
				<li className="step step-secondary">Create an Event</li>
				<li className="step step-secondary">Set the Location</li>
				<li className="step">Describe the Event</li>
			</ul>
		</>
	);
};

export default StepTwo;
