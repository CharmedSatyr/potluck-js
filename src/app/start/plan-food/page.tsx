"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormInput {
	name: string;
	signups: number;
}

const PlanFoodPage = () => {
	const { replace } = useRouter();
	const searchParams = useSearchParams();

	const shortId = searchParams.get("event");

	if (!shortId) {
		replace(`/start`);
	}

	const onSubmit = () => {};

	const { handleSubmit, register } = useForm<FormInput>({ defaultValues: {} });

	return (
		<form
			className="form-control w-full lg:w-5/6 xl:w-2/3 2xl:w-1/2"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1>Plan the Food</h1>

			<div>Create Your Slots</div>

			<div>
				<div className="form-control">
					<label htmlFor="dish-name" className="label-text">
						What's Needed
					</label>
					<input
						className="input-text input input-bordered"
						id="dish-name"
						type="text"
						{...register("name", {
							required: true,
						})}
					/>
				</div>

				<div className="form-control">
					<label htmlFor="quantity-input" className="label-text">
						Choose quantity:
					</label>
					<div className="join">
						<button
							type="button"
							id="decrement-button"
							data-input-counter-decrement="quantity-input"
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
							id="quantity-input"
							data-input-counter
							aria-describedby="helper-text-explanation"
							className="input join-item input-bordered"
							placeholder="0"
							{...register("signups", {
								required: true,
							})}
						/>
						<button
							type="button"
							id="increment-button "
							data-input-counter-increment="quantity-input"
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
		</form>
	);
};

export default PlanFoodPage;
