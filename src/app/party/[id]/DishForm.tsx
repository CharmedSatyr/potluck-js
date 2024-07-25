"use client";

import { useParams } from "next/navigation";
import { startTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInput } from "@/app/party/[id]/types";

interface Props {
	action: any;
}

const DishForm = ({ action }: Props) => {
	const { id: shortId } = useParams<{ id: string }>();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInput>();

	const onSubmit: SubmitHandler<FormInput> = async (data: FormInput) =>
		startTransition(() => {
			if (Object.keys(errors).length > 0) {
				return;
			}

			action({ ...data, shortId });
		});

	return (
		<form className="m-20 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
			<label htmlFor="createdBy">What Is Your Name</label>
			<input
				className="mb-4 text-slate-900"
				id="createdBy"
				type="text"
				{...register("createdBy", {
					required: "This field is required",
					maxLength: 256,
				})}
			/>
			{errors.name && (
				<span className="-mt-2 text-red-500">{errors.name.message}</span>
			)}

			<label htmlFor="name">What are you bringing?</label>
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

			<label htmlFor="description">Describe your dish</label>
			<input
				className="mb-4 text-slate-900"
				id="description"
				type="text"
				{...register("description", {
					required: "This field is required",
					maxLength: 256,
				})}
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

export default DishForm;
