"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import QuantityInput from "@/components/quantity-input";
import { FoodPlan } from "@/db/schema/food-plan";

interface Props {
	foodPlans: FoodPlan[];
}

type PlanT = FoodPlan & { index: number };

interface FormInput {
	description: string;
	quantity: number;
}

const Plan = ({ course, count, index }: PlanT) => {
	const [checked, setChecked] = useState<boolean>(false);
	const [claimed, setClaimed] = useState<number>(0);
	const { handleSubmit, register, setValue } = useForm<FormInput>();

	useEffect(() => {
		setValue(`quantity` as const, claimed);
	}, [claimed, setValue, index]);

	const onSubmit = (data: FormInput) => console.log(data);

	return (
		<div className="collapse w-full">
			<input
				type="checkbox"
				checked={checked}
				onChange={() => setChecked(!checked)}
			/>

			<div className="collapse-title flex w-full items-center justify-between">
				<div className="w-8/12 text-2xl">{course}</div>
				<div className="flex items-center justify-between">
					{claimed} of {count} filled
					{checked ? (
						<ChevronUpIcon className="-mr-6 ml-2 size-6" />
					) : (
						<ChevronDownIcon className="-mr-6 ml-2 size-6" />
					)}
				</div>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="collapse-content flex items-end justify-between"
			>
				<QuantityInput
					index={index}
					labelText="Quantity You'll Bring"
					max={count}
					min={1}
					quantity={claimed}
					setQuantity={setClaimed}
				/>

				<input
					className="input-text input input-bordered w-1/2"
					placeholder="(optional) Add a comment"
					type="text"
					{...register(`description` as const, {
						maxLength: 256,
					})}
				/>
				<input className="btn btn-accent" type="submit" />
			</form>
		</div>
	);
};

const FoodPlanManager = ({ foodPlans }: Props) => {
	return (
		<div>
			<h2>Food Plan</h2>

			<div className="join join-vertical w-full border">
				{foodPlans.map((plan, index) => (
					<div key={plan.id} className="join-item border">
						<Plan {...plan} index={index} />
					</div>
				))}
			</div>
		</div>
	);
};

export default FoodPlanManager;
