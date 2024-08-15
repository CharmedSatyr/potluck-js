"use client";

import { NewParty } from "@/actions/db/create-party";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { FormInput } from "@/app/create-party/page";

const StepOne = () => {
	const { push } = useRouter();
	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useFormContext<FormInput>();

	const submit = (_: Partial<NewParty>) => {
		push(`/create-party/step-two`);
	};

	return (
		<>
			<form
				className="form-control w-full p-10"
				onSubmit={handleSubmit(submit)}
			>
				<div className="my-2">
					<label htmlFor="name" className="label label-text">
						Name Your Event
					</label>

					<input
						className="input input-bordered w-full"
						id="name"
						type="text"
						{...register("name", {
							required: "This field is required",
							maxLength: 256,
						})}
					/>
					<span className="text-error">{errors.name?.message}</span>
				</div>

				<div className="my-2">
					<label htmlFor="hosts" className="label label-text">
						Who Is Hosting This Event?
					</label>

					<input
						className="form-control input input-bordered w-full"
						id="hosts"
						type="text"
						{...register("hosts", {
							required: "This field is required",
							maxLength: 256,
						})}
					/>
					<span className="text-error">{errors.hosts?.message}</span>
				</div>

				<div className="my-2">
					<label htmlFor="time" className="label label-text">
						Time
					</label>
					<div className="flex w-full justify-between">
						<input
							className="input input-bordered w-7/12"
							id="time"
							type="date"
							{...register("startDate", {
								required: "This field is required",
							})}
						/>
						<input
							className="input input-bordered w-4/12"
							id="time"
							type="time"
							step={60}
							{...register("startTime", {
								required: "This field is required",
								setValueAs: (time: string) => time.concat(":00"),
							})}
						/>
					</div>
					<span className="text-error">{errors.startDate?.message}</span>
					<span className="text-error">{errors.startTime?.message}</span>
				</div>

				<input
					type="submit"
					className="btn btn-primary my-8 w-full"
					value="Next"
				/>
			</form>

			<ul className="steps w-full">
				<li className="step step-secondary">Create an Event</li>
				<li className="step">Set the Location</li>
				<li className="step">Describe the Event</li>
			</ul>
		</>
	);
};

export default StepOne;
