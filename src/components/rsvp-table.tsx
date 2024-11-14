import Image from "next/image";
import { Rsvp } from "@/db/schema/rsvp";
import { User } from "@/db/schema/auth/user";

type Props = {
	rsvps: {
		createdBy: Rsvp["createdBy"];
		id: Rsvp["id"];
		response: Rsvp["response"];
	}[];
	rsvpUsers: User[];
};

const RsvpTable = ({ rsvps, rsvpUsers }: Props) => {
	return (
		<div className="overflow-x-auto">
			<table className="table">
				<thead>
					<tr>
						<th>RSVP</th>
						<th>Name</th>
						<th>Notes</th>
					</tr>
				</thead>
				<tbody>
					{rsvps.map((rsvp) => {
						const user = rsvpUsers.find((r) => r.id === rsvp.createdBy);
						return (
							<tr key={rsvp.id}>
								<th>
									<label>
										{rsvp.response === "yes" ? (
											<div className="badge badge-success">Attending</div>
										) : (
											<div className="badge badge-neutral">Not Attending</div>
										)}
									</label>
								</th>
								<td className="flex items-center gap-2">
									<Image
										alt={`${user?.name}'s avatar`}
										className="avatar my-0 rounded-full border"
										src={user?.image ?? ""}
										height="30"
										width="30"
									/>{" "}
									{user?.name}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default RsvpTable;
