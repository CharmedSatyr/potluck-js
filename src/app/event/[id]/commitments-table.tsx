"use client";

import { Commitment } from "@/db/schema/commitment";
import { User } from "@/db/schema/auth/user";
import Image from "next/image";
import DeleteCommitmentForm from "@/app/event/[id]/delete-commitment-form";
import { useSession } from "next-auth/react";

const CommitmentsTable = ({
	commitments,
	users,
}: {
	commitments: Commitment[];
	users: Pick<User, "id" | "image" | "name">[];
}) => {
	const { data } = useSession();
	const id = data?.user?.id;

	if (!commitments.length) {
		return null;
	}

	return (
		<div className="overflow-x-auto">
			<table className="table mt-0">
				<thead>
					<tr>
						<th></th>
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
								height={32}
								width={32}
							/>
						) : (
							<div className="skeleton h-8 w-8 rounded-full border" />
						);

						return (
							<tr key={commitment.id}>
								<td>
									{id === user.id && (
										<DeleteCommitmentForm id={commitment.id} />
									)}
								</td>
								<td>{image}</td>
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

export default CommitmentsTable;
