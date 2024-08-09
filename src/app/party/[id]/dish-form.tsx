"use client";

import { useParams } from "next/navigation";
import { startTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { NewDish } from "@/actions/create-dish";

interface Props {
	handleCreate: (data: FormInput) => Promise<void>;
	close: () => void;
}

export type FormInput = NewDish;

const DishForm = ({ handleCreate, close }: Props) => {
	const { id: shortId } = useParams<{ id: string }>();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInput>({
		defaultValues: {
			createdBy: "Jesse Royalty",
			description: "Mushroom birria with cheese",
			name: "Vegetable Monday",
		},
	});

	const onSubmit: SubmitHandler<FormInput> = async (data: FormInput) =>
		startTransition(() => {
			if (Object.keys(errors).length > 0) {
				return;
			}

			handleCreate({ ...data, shortId });
			close();
		});

	return (
		<dialog className="modal" id="dish_modal">
			<div className="modal-action">
				<form
					method="dialog"
					className="modal-box flex flex-col"
					onSubmit={handleSubmit(onSubmit)}
				>
					<h3 className="mb-4 text-lg font-bold">Bring a Dish</h3>
					<label htmlFor="createdBy" className="mb-2">
						Your Name
					</label>
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

					<label htmlFor="name" className="mb-2">
						What are you bringing?
					</label>
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

					<label htmlFor="description" className="mb-2">
						Notes
					</label>
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
						<span className="-mt-2 text-red-500">
							{errors.description.message}
						</span>
					)}

					<input type="submit" className="btn" />
				</form>
			</div>
		</dialog>
	);
};

export default DishForm;
