import { Commitment } from "@/db/schema/commitment";
import { User } from "@/db/schema/auth/user";
import Image from "next/image";

const CommitmentsTable = ({
	commitments,
	users,
}: {
	commitments: Commitment[];
	users: Pick<User, "id" | "image" | "name">[];
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

export default CommitmentsTable;
