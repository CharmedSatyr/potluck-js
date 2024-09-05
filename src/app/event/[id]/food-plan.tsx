"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import QuantityInput from "@/components/quantity-input";
import { FoodPlan } from "@/db/schema/food-plan";
import { useSession } from "next-auth/react";
import Image from "next/image";
import createCommitment from "@/actions/db/create-commitment";
import { Commitment } from "@/db/schema/commitment";
import { Return } from "@/actions/db/find-commitments";

interface PlanProps extends FoodPlan {
	index: number;
	commitments: Commitment[];
}

interface FormInput {
	description: string;
	quantity: number;
}

const Plan = ({ commitments, course, count, id, index }: PlanProps) => {
	const [checked, setChecked] = useState<boolean>(false);
	const [claimed, setClaimed] = useState<number>(0);
	const { handleSubmit, register, setValue } = useForm<FormInput>();

	console.log("Commitments:", commitments);
	const taken = commitments.reduce((acc, curr) => acc + curr.quantity, 0);

	const uniqueAvatars = new Set(commitments.map((c) => c.avatar));
	const images = Array.from(uniqueAvatars).map((avatar) => (
		<Image
			key={avatar}
			className="m-0 rounded-full p-0"
			alt="me"
			width={50}
			height={50}
			src={avatar}
		/>
	));

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
				{images}
				<div className="flex items-center justify-between">
					{taken} of {count} filled
					{checked ? (
						<ChevronUpIcon className="-mr-6 ml-2 size-6" />
					) : (
						<ChevronDownIcon className="-mr-6 ml-2 size-6" />
					)}
				</div>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="collapse-content form-control w-full"
			>
				<h3 className="mt-0">Current Signups</h3>
				<div className="overflow-x-auto">
					<table className="table mt-0">
						<thead>
							<tr>
								<th>Avatar</th>
								<th>Quantity</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							{commitments.map((c) => {
								return (
									<tr key={c.id}>
										<td className="avatar">
											<Image
												className="m-0 rounded-full"
												alt="The person who's brunging"
												width={25}
												height={25}
												src={c.avatar}
											/>
										</td>
										<td>{c.quantity}</td>
										<td>{c.description}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				<div className="flex w-full items-end justify-between">
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
				</div>
			</form>
		</div>
	);
};

interface Props {
	commitments: Return;
	foodPlans: FoodPlan[];
}

const FoodPlanManager = ({ commitments, foodPlans }: Props) => {
	return (
		<div>
			<h2>Food Plan</h2>

			<div className="join join-vertical w-full border">
				{foodPlans.map((plan, index) => {
					return (
						<div key={plan.id} className="join-item border">
							<Plan
								{...plan}
								commitments={commitments[plan.id] ?? []}
								index={index}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default FoodPlanManager;
