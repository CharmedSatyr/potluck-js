"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormInput {
	dishName: string;
	needed: number;
}

const FoodInput = ({ register, slot }: any) => {
	const [count, setCount] = useState<number>(1);

	return (
		<div className="flex w-full justify-between">
			<div className="form-control w-2/3">
				<label htmlFor="dish-name" className="label label-text">
					What's Needed
				</label>
				<input
					className="input-text input input-bordered"
					id="dish-name"
					type="text"
					{...register("dishName", {
						required: true,
					})}
				/>
			</div>

			<div className="form-control items-end">
				<label htmlFor="quantity-input" className="label label-text">
					Signups Needed
				</label>
				<div className="join">
					<button
						onClick={() => setCount(count > 1 ? count - 1 : 1)}
						type="button"
						className="btn join-item input-bordered"
					>
						<svg
							className="h-3 w-3 text-gray-900 dark:text-white"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 18 2"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M1 1h16"
							/>
						</svg>
					</button>
					<input
						type="text"
						className="input join-item input-bordered w-12"
						id="quantity-input"
						placeholder="0"
						value={count}
						{...register("needed", {
							required: true,
						})}
					/>
					<button
						onClick={() => setCount(count + 1)}
						type="button"
						className="btn join-item input-bordered"
					>
						<svg
							className="h-3 w-3 text-gray-900 dark:text-white"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 18 18"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 1v16M1 9h16"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

const PlanFoodPage = () => {
	const { replace } = useRouter();
	const searchParams = useSearchParams();
	const [slots, setSlots] = useState<number>(1);
	const { handleSubmit, register } = useForm<FormInput>({ defaultValues: {} });

	const shortId = searchParams.get("event");

	if (!shortId) {
		replace(`/start`);
	}

	const onSubmit = (data: FormInput) => {
		console.log("Submitting data:", data);
	};

	return (
		<form
			className="form-control w-full lg:w-5/6 xl:w-2/3 2xl:w-1/2"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1>Plan the Food</h1>

			<h2>Create Your Slots</h2>

			{Array.from({ length: slots }, (_, index) => (
				<div key={`slot-${index}`}>
					<FoodInput register={register} slot={index} />
					<div className="divider mt-6" />
				</div>
			))}

			<button
				onClick={() => setSlots(slots < 20 ? slots + 1 : 20)}
				className="btn btn-secondary w-1/4"
			>
				Add Slot
			</button>

			<input className="btn btn-primary my-8" type="submit" />
		</form>
	);
};

export default PlanFoodPage;
