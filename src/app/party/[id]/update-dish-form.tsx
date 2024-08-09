"use client";

import { startTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdatedDish } from "@/actions/update-dish";
import { Dish } from "@/db/schema/dishes";

interface Props {
	close: () => void;
	handleUpdate: (data: FormInput) => Promise<void>;
	id: Dish["id"];
}

export type FormInput = UpdatedDish;

const UpdateDishForm = ({ close, handleUpdate, id }: Props) => {
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

			handleUpdate({ ...data, id });
			close();
		});

	return (
		<dialog className="modal" id="update_dish_modal">
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

					<h2 className="mt-0">Update Your Dish</h2>

					<div className="my-2">
						<label htmlFor="name" className="label label-text">
							What are you bringing?
						</label>
						<div className="input input-bordered flex items-center gap-2">
							<input
								className="grow"
								id="name"
								type="text"
								{...register("name", { required: false, maxLength: 256 })}
							/>
							<span className="badge badge-accent">Optional</span>
						</div>
						<span className="text-error">{errors.name?.message}</span>
					</div>

					<div className="my-2">
						<label htmlFor="description" className="label label-text">
							Notes
						</label>
						<div className="input input-bordered flex items-center gap-2">
							<input
								className="grow"
								id="description"
								type="text"
								{...register("description", {
									maxLength: 256,
								})}
							/>
							<span className="badge badge-accent">Optional</span>
						</div>
						<span className="text-error">{errors.description?.message}</span>
					</div>

					<input type="submit" className="btn btn-secondary mt-6" />
				</form>
			</div>
		</dialog>
	);
};

export default UpdateDishForm;
