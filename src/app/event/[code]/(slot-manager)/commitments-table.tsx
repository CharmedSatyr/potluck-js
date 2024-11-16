"use client";

import { Commitment } from "@/db/schema/commitment";
import { User } from "@/db/schema/auth/user";
import Image from "next/image";
import DeleteCommitmentForm from "@/app/event/[code]/(slot-manager)/delete-commitment-form";
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
		<div className="overflow-x-auto" id="commitments-table">
			<table className="table mt-0">
				<thead>
					<tr>
						<th></th>
						<th>Name</th>
						<th>Quantity</th>
						<th>Notes</th>
					</tr>
				</thead>

				<tbody>
					{commitments.map((commitment) => {
						const [user] = users.filter((u) => u.id === commitment.createdBy);
						const image = user.image ? (
							<Image
								alt={`Avatar for user ${user.name}`}
								className="avatar my-0 mr-1 rounded-full border"
								src={user.image}
								height={32}
								width={32}
							/>
						) : (
							<div className="skeleton h-8 w-8 rounded-full border" />
						);

						return (
							<tr key={commitment.id}>
								<td className="max-w-4">
									{id === user.id && (
										<DeleteCommitmentForm id={commitment.id} />
									)}
								</td>
								<td>
									{image} {user.name}
								</td>
								<td>{commitment.quantity}</td>
								<td>{commitment.description}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div >
	);
};

export default CommitmentsTable;
