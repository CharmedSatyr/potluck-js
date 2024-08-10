"use client";

import { useParams } from "next/navigation";
import { startTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { NewDish } from "@/actions/db/create-dish";

interface Props {
	handleCreate: (data: FormInput) => Promise<void>;
	close: () => void;
}

export type FormInput = Omit<NewDish, "createdBy">;

const CreateDishForm = ({ handleCreate, close }: Props) => {
	const { id: shortId } = useParams<{ id: string }>();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInput>({
		defaultValues: {
			description: "Mushroom birria with cheese",
			name: "Tacos",
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
		<dialog className="modal" id="create_dish_modal">
			<div className="modal-action w-1/2">
				<form
					method="dialog"
					className="form-control modal-box w-full max-w-none"
					onSubmit={handleSubmit(onSubmit)}
				>
					<button
						className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
						onClick={(e) => {
							e.preventDefault();
							close();
						}}
					>
						✕
					</button>

					<h2 className="mt-0">Sign Up to Bring a Dish</h2>

					<div className="my-2">
						<label htmlFor="name" className="label label-text">
							What are you bringing?
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
						<label htmlFor="description" className="label label-text">
							Notes
						</label>
						<input
							className="input input-bordered w-full"
							id="description"
							type="text"
							{...register("description", {
								required: "This field is required",
								maxLength: 256,
							})}
						/>
						<span className="text-error">{errors.description?.message}</span>
					</div>

					<input type="submit" className="btn btn-secondary mt-6" />
				</form>
			</div>
		</dialog>
	);
};

export default CreateDishForm;
