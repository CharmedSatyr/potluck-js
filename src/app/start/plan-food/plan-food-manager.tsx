"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, UseFormRegister, UseFormSetValue } from "react-hook-form";
import createFoodPlan from "@/actions/db/create-food-plan";
import { CustomizableFoodPlanValues } from "@/db/schema/food-plan";
import { useSession } from "next-auth/react";
import signInWithDiscord from "@/actions/auth/sign-in-with-discord";

const MAX_DISH_SLOTS = 20;

interface FormInput {
	[key: string]: CustomizableFoodPlanValues;
}

interface CourseInputProps {
	register: UseFormRegister<FormInput>;
	setValue: UseFormSetValue<FormInput>;
	slot: number;
}

const CourseInput = ({ register, setValue, slot }: CourseInputProps) => {
	const [count, setCount] = useState<number>(1);

	useEffect(() => {
		setValue(`${slot}.count`, count);
	}, [count, setValue, slot]);

	return (
		<div className="flex w-full justify-between">
			<div className="form-control w-2/3">
				<label htmlFor="dish-name" className="label label-text">
					What&apos;s Needed
				</label>
				<input
					className="input-text input input-bordered"
					id="dish-name"
					type="text"
					{...register(`${slot}.course`, {
						maxLength: 256,
						required: "Slot name required",
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
						className="input join-item input-bordered w-14"
						id="quantity-input"
						value={count}
						readOnly
					/>

					<button
						onClick={() =>
							setCount(count < MAX_DISH_SLOTS ? count + 1 : MAX_DISH_SLOTS)
						}
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

const PlanFoodManager = () => {
	const { status } = useSession();
	const loggedIn = status === "authenticated";

	const { push, replace } = useRouter();
	const searchParams = useSearchParams();
	const [slots, setSlots] = useState<number>(1);
	const {
		formState: { isDirty, isValid, errors },
		handleSubmit,
		register,
		setValue,
	} = useForm<FormInput>({ defaultValues: {} });

	const shortId = searchParams.get("event");

	if (!shortId) {
		replace(`/start`);
		return null;
	}

	const onSubmit = async (data: FormInput) => {
		if (!loggedIn) {
			await signInWithDiscord();

			return;
		}

		try {
			const plan = { courses: data, shortId };

			await createFoodPlan(plan);

			push(`/party/${shortId}`);
		} catch (err) {
			console.error(err);
		}
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
					<CourseInput register={register} slot={index} setValue={setValue} />
					<span className="text-secondary">
						{errors[`${index}.course`]?.message}
					</span>
					<div className="divider mt-6" />
				</div>
			))}

			<button
				disabled={slots >= MAX_DISH_SLOTS}
				onClick={() =>
					setSlots(slots < MAX_DISH_SLOTS ? slots + 1 : MAX_DISH_SLOTS)
				}
				className="btn btn-secondary w-1/4"
			>
				{slots < MAX_DISH_SLOTS ? "Add Slot" : "Limit Reached"}
			</button>

			<input
				className="btn btn-primary my-8"
				type="submit"
				disabled={!isDirty || !isValid}
			/>
		</form>
	);
};

export default PlanFoodManager;
