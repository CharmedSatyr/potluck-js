"use client";

import { NewParty } from "@/actions/db/create-party";
import { startTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
	handleCreateParty: (data: NewParty) => Promise<void>;
	username: string;
}

export type FormInput = Omit<NewParty, "createdBy">;

const PartyForm = ({ handleCreateParty, username }: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInput>({
		defaultValues: {
			description: "A day to celebrate farmers and farmers markets!",
			end: "2025-01-09T12:00" as unknown as Date, // Automatically converted by valueAsDate
			hosts: "Joseph & Inga Wolfe",
			location: "100 Rue de Boeuf, Paris, France 1000",
			name: "Vegetable Monday",
			start: "2025-01-09T15:00" as unknown as Date, // Automatically converted by valueAsDate
		},
	});

	const onSubmit: SubmitHandler<FormInput> = async (data: FormInput) =>
		startTransition(() => {
			if (Object.keys(errors).length > 0) {
				return;
			}

			handleCreateParty({ ...data, createdBy: username });
		});

	return (
		<form className="form-control" onSubmit={handleSubmit(onSubmit)}>
			<div className="my-2">
				<label htmlFor="hosts" className="label label-text">
					Hosts
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
				<label htmlFor="name" className="label label-text">
					Party Name
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
				<label htmlFor="location" className="label label-text">
					Location{" "}
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

			<div className="my-2">
				<label htmlFor="start" className="label label-text">
					Start
				</label>
				<input
					className="input input-bordered w-full"
					id="start"
					type="datetime-local"
					{...register("start", {
						required: "This field is required",
						valueAsDate: true,
					})}
				/>
				<span className="text-error">{errors.start?.message}</span>
			</div>

			<div className="my-2">
				<label htmlFor="end" className="label label-text">
					End
				</label>
				<input
					className="input input-bordered w-full"
					id="end"
					type="datetime-local"
					{...register("end", {
						required: "This field is required",
						valueAsDate: true,
					})}
				/>
				<span className="text-error">{errors.end?.message}</span>
			</div>

			<div className="my-2">
				<label htmlFor="description" className="label label-text">
					Description{" "}
				</label>
				<div className="input input-bordered flex items-center gap-2">
					<input
						className="grow"
						id="description"
						type="text"
						{...register("description", { required: false, maxLength: 256 })}
					/>
					<span className="badge badge-accent">Optional</span>
				</div>
				<span className="error">{errors.description?.message}</span>
			</div>

			<input type="submit" className="btn btn-primary my-8" />
		</form>
	);
};

export default PartyForm;
