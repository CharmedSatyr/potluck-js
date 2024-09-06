"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import createCommitment from "@/actions/db/create-commitment";
import { revalidatePage } from "@/actions/revalidate-path";
import QuantityInput from "@/components/quantity-input";
import { Commitment } from "@/db/schema/commitment";
import { Request } from "@/db/schema/food-plan";

interface Props {
	commitments: Commitment[];
	index: number;
	request: Request;
}

type FormInput = Pick<Commitment, "description" | "quantity">;

const RequestDetails = ({ commitments, request, index }: Props) => {
	const pathName = usePathname();
	const [expanded, setExpanded] = useState<boolean>(false);
	const [commitQuantity, setCommitQuantity] = useState<number>(0);
	const { handleSubmit, register, setValue } = useForm<FormInput>();

	const totalCommitments: number = commitments.reduce(
		(acc, curr) => acc + curr.quantity,
		0
	);

	const placeholderImages = commitments.map((commitment) => (
		<div
			key={commitment.id}
			className="skeleton h-12 w-12 rounded-full border"
		/>
	));

	useEffect(() => {
		setValue("quantity", commitQuantity);
	}, [commitQuantity, setValue, index]);

	const onSubmit = async ({ description, quantity }: FormInput) => {
		const result = await createCommitment({
			description,
			foodPlanId: request.id,
			quantity,
		});

		if (result.length === 0) {
			return;
		}

		await revalidatePage(pathName);
	};

	return (
		<div className="collapse w-full">
			<input
				type="checkbox"
				checked={expanded}
				onChange={() => setExpanded(!expanded)}
			/>

			<div className="collapse-title flex w-full items-center justify-between">
				<div className="w-8/12 text-2xl">{request.course}</div>
				{placeholderImages}
				<div className="flex items-center justify-between">
					{totalCommitments} of {request.count} filled
					{expanded ? (
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
				{commitments.length ? (
					<CommitmentsTable commitments={commitments} />
				) : (
					<p>None yet. Be the first!</p>
				)}

				<div className="flex w-full items-end justify-between">
					<QuantityInput
						index={index}
						labelText="Quantity You'll Bring"
						max={request.count}
						min={1}
						quantity={commitQuantity}
						setQuantity={setCommitQuantity}
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
						disabled={commitQuantity < 1}
						className="btn btn-secondary"
						type="submit"
						value="Save"
					/>
				</div>
			</form>
		</div>
	);
};

const CommitmentsTable = ({ commitments }: { commitments: Commitment[] }) => {
	return (
		<div className="overflow-x-auto">
			<table className="table mt-0">
				<thead>
					<tr>
						<th>Avatar</th>
						<th>Display Name</th>
						<th>Quantity</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{commitments.map((commitment) => {
						return (
							<tr key={commitment.id}>
								<td className="avatar">
									<div className="skeleton h-8 w-8 rounded-full border" />
								</td>
								<td>Placeholder</td>
								<td>{commitment.quantity}</td>
								<td>{commitment.description}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default RequestDetails;
