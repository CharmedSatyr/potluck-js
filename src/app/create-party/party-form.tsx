"use client";

import { NewParty } from "@/actions/create-party";
import { startTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
	action: (data: NewParty) => Promise<void>;
}

export interface FormInput {
	createdBy: NewParty["createdBy"];
	description: NewParty["description"];
	end: NewParty["end"];
	start: NewParty["start"];
	hosts: NewParty["hosts"];
	name: NewParty["name"];
}

const PartyForm = ({ action }: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInput>({
		defaultValues: {
			description: "A day to celebrate farmers and farmers markets",
			end: "2024-09-28T00:00" as unknown as Date, // Automatically converted by valueAsDate
			hosts: "Joseph & Inga Wolfe",
			name: "Vegetable Monday",
			start: "2024-09-30T00:00" as unknown as Date, // Automatically converted by valueAsDate
		},
	});

	const onSubmit: SubmitHandler<FormInput> = async (data) =>
		startTransition(() => {
			if (Object.keys(errors).length > 0) {
				return;
			}

			action({ ...data, createdBy: "Auth value" });
		});

	return (
		<form className="m-20 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
			<label htmlFor="hosts">Hosts</label>
			<input
				className="mb-4 text-slate-900"
				id="hosts"
				type="text"
				{...register("hosts", {
					required: "This field is required",
					maxLength: 256,
				})}
			/>
			{errors.hosts && (
				<span className="-mt-2 text-red-500">{errors.hosts.message}</span>
			)}

			<label htmlFor="name">Party Name</label>
			<input
				className="mb-4 text-slate-900"
				id="name"
				type="text"
				{...register("name", {
					required: "This field is required",
					maxLength: 256,
				})}
			/>
			{errors.name && (
				<span className="-mt-2 text-red-500">{errors.name.message}</span>
			)}

			<label htmlFor="start">Start</label>
			<input
				className="mb-4 text-slate-900"
				id="start"
				type="datetime-local"
				{...register("start", {
					required: "This field is required",
					valueAsDate: true,
				})}
			/>
			{errors.start && (
				<span className="-mt-2 text-red-500">{errors.start.message}</span>
			)}

			<label htmlFor="end">End</label>
			<input
				className="mb-4 text-slate-900"
				id="end"
				type="datetime-local"
				{...register("end", {
					required: "This field is required",
					valueAsDate: true,
				})}
			/>
			{errors.end && (
				<span className="-mt-2 text-red-500">{errors.end.message}</span>
			)}

			<label htmlFor="description">Description</label>
			<input
				className="mb-4 text-slate-900"
				id="description"
				type="text"
				{...register("description", { required: false })}
			/>
			{errors.description && (
				<span className="-mt-2 text-red-500">{errors.description.message}</span>
			)}

			<input
				type="submit"
				className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
			/>
		</form>
	);
};

export default PartyForm;
