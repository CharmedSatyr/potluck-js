"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import createCommitment from "@/actions/db/create-commitment";
import { revalidatePage } from "@/actions/revalidate-path";
import QuantityInput from "@/components/quantity-input";
import { Commitment } from "@/db/schema/commitment";
import { Request } from "@/db/schema/request";
import { User } from "@/db/schema/auth/user";

interface Props {
	commitments: Commitment[];
	index: number;
	request: Request;
	users: User[];
}

type FormInput = Pick<Commitment, "description" | "quantity">;

const RequestDetails = ({ commitments, request, index, users }: Props) => {
	const pathName = usePathname();
	const [expanded, setExpanded] = useState<boolean>(false);
	const [commitQuantity, setCommitQuantity] = useState<number>(0);
	const { handleSubmit, register, reset, setValue } = useForm<FormInput>();

	const totalCommitments: number = commitments.reduce(
		(acc, curr) => acc + curr.quantity,
		0
	);

	const avatars = users.map((user) =>
		user.image ? (
			<Image
				key={user.id}
				alt={`Avatar for user ${user.name}`}
				className="avatar my-0 rounded-full border"
				src={user.image}
				height={40}
				width={40}
			/>
		) : (
			<div key={user.id} className="skeleton h-8 w-8 rounded-full border" />
		)
	);

	useEffect(() => {
		setValue("quantity", commitQuantity);
	}, [commitQuantity, setValue, index]);

	const onSubmit = async ({ description, quantity }: FormInput) => {
		const result = await createCommitment({
			description,
			quantity,
			requestId: request.id,
		});

		if (result.length === 0) {
			return;
		}

		reset();
		setCommitQuantity(0);

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
				<div className="w-6/12 text-2xl">{request.course}</div>
				{avatars}
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
					<CommitmentsTable commitments={commitments} users={users} />
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

const CommitmentsTable = ({
	commitments,
	users,
}: {
	commitments: Commitment[];
	users: User[];
}) => {
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
						const [user] = users.filter((u) => u.id === commitment.createdBy);
						const image = user.image ? (
							<Image
								alt={`Avatar for user ${user.name}`}
								className="avatar my-0 rounded-full border"
								src={user.image}
								height={25}
								width={25}
							/>
						) : (
							<div className="skeleton h-8 w-8 rounded-full border" />
						);

						return (
							<tr key={commitment.id}>
								<td className="avatar">{image}</td>
								<td>{user.name}</td>
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
