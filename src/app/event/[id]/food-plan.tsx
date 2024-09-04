"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import QuantityInput from "@/components/quantity-input";
import { FoodPlan } from "@/db/schema/food-plan";
import { useSession } from "next-auth/react";
import Image from "next/image";
import createCommitment from "@/actions/db/create-commitment";

interface Props {
	foodPlans: FoodPlan[];
}

type PlanT = FoodPlan & { index: number };

interface FormInput {
	description: string;
	quantity: number;
}

const Plan = ({ course, count, id, index }: PlanT) => {
	const session = useSession();
	const [checked, setChecked] = useState<boolean>(false);
	const [claimed, setClaimed] = useState<number>(0);
	const { handleSubmit, register, setValue } = useForm<FormInput>();

	useEffect(() => {
		setValue("quantity", claimed);
	}, [claimed, setValue, index]);

	const onSubmit = async ({ description, quantity }: FormInput) => {
		const result = await createCommitment({
			description,
			foodPlanId: id,
			quantity,
		});

		if (result.length > 0) {
			console.log("YAY", result);
		}
	};

	return (
		<div className="collapse w-full">
			<input
				type="checkbox"
				checked={checked}
				onChange={() => setChecked(!checked)}
			/>

			<div className="collapse-title flex w-full items-center justify-between">
				<div className="w-8/12 text-2xl">{course}</div>
				<Image
					className="m-0 rounded-full p-0"
					alt="me"
					width={50}
					height={50}
					src={session.data?.user?.image!}
				/>
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
					{...register("description", {
						maxLength: 256,
					})}
				/>
				<input
					disabled={claimed < 1}
					className="btn btn-secondary"
					type="submit"
					value="Save"
				/>
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
