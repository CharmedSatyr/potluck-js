import { User } from "@/db/schema/auth/user";
import { Commitment } from "@/db/schema/commitment";
import { Slot } from "@/db/schema/slot";
import Image from "next/image";

type Props = {
	commitments: Commitment[];
	slots: Slot[];
	users: User[];
};

const CommitmentsTable = ({ commitments, slots, users }: Props) => {
	return (
		<div className="overflow-x-auto">
			<table className="table">
				<thead>
					<tr>
						<th>User</th>
						<th>Item</th>
						<th>Quantity</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{commitments.map((c) => {
						const user = users.find((u) => u.id === c.createdBy);
						const course = slots.find((s) => s.id === c.slotId)?.course;

						// TODO: Some fallbacks for missing/deleted users or courses.
						return (
							<tr key={c.id}>
								<td className="flex items-center gap-2">
									<Image
										alt={`${user?.name}'s avatar`}
										className="avatar my-0 rounded-full border"
										src={user?.image ?? ""}
										height="20"
										width="20"
									/>{" "}
									{user?.name}
								</td>
								<td>{course}</td>
								<td>{c.quantity}</td>
								<td>{c.description}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default CommitmentsTable;
