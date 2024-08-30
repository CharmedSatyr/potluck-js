"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormInput {
	name: string;
	needed: number;
}

const PlanFoodPage = () => {
	const { replace } = useRouter();
	const searchParams = useSearchParams();
	const [count, setCount] = useState<number>(0);

	const shortId = searchParams.get("event");

	if (!shortId) {
		replace(`/start`);
	}

	const onSubmit = (data: FormInput) => {
		console.log("Submitting data:", data);
	};

	const { handleSubmit, register } = useForm<FormInput>({ defaultValues: {} });

	return (
		<form
			className="form-control w-full lg:w-5/6 xl:w-2/3 2xl:w-1/2"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1>Plan the Food</h1>

			<h2>Create Your Slots</h2>

			<div className="flex w-full justify-between">
				<div className="form-control w-2/3">
					<label htmlFor="dish-name" className="label label-text">
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

				<div className="form-control items-end">
					<label htmlFor="quantity-input" className="label label-text">
						Signups Needed
					</label>
					<div className="join">
						<button
							onClick={() => setCount(count > 0 ? count - 1 : 0)}
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
			<input className="btn btn-primary my-12" type="submit" />
		</form>
	);
};

export default PlanFoodPage;
