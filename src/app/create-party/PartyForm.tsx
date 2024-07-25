"use client";

import createParty from "@/actions/create-party";
import { startTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export interface FormInput {
	createdBy: "Auth value";
	description: string;
	end: Date;
	start: Date;
	hosts: string;
	name: string;
}

const PartyForm = () => {
	const onSubmit: SubmitHandler<FormInput> = async (data) =>
		startTransition(() => {
			if (Object.keys(errors).length > 0) {
				return;
			}

			createParty({ ...data, createdBy: "Auth value" });
		});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInput>();

	console.log("errors: ", errors);

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
