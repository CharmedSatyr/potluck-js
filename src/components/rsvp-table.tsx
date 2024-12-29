import findRsvpsWithDetails from "@/actions/db/find-rsvps-with-details";
import findUserByEventCode from "@/actions/db/find-user-by-event-code";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type Props = {
	code: string;
};

const RsvpTable = async ({ code }: Props) => {
	const [creator] = await findUserByEventCode({ code });

	const rsvpsWithDetails = await findRsvpsWithDetails({ code });

	const hostIdx = rsvpsWithDetails.findIndex(
		(rsvp) => rsvp.user.id === creator.id
	);

	if (hostIdx >= 0) {
		const [host] = rsvpsWithDetails.splice(hostIdx, 1);

		host.message = (
			<span className="flex items-center gap-1">
				<CheckBadgeIcon className="text-primary" height="20" width="20" />
				Event Host
			</span>
		) as unknown as string; // TODO: Massage the client type.

		rsvpsWithDetails.unshift(host);
	}

	return (
		<div className="overflow-x-auto">
			<table className="table table-xs md:table-md">
				<thead>
					<tr>
						<th>RSVP</th>
						<th>Name</th>
						<th>Notes</th>
					</tr>
				</thead>
				<tbody>
					{rsvpsWithDetails.map((rsvp) => {
						return (
							<tr key={rsvp.id}>
								<th>
									<label>
										{rsvp.response === "yes" ? (
											<div className="badge badge-success badge-sm md:badge-md">
												Attending
											</div>
										) : (
											<div className="badge badge-neutral badge-sm md:badge-md">
												Not Attending
											</div>
										)}
									</label>
								</th>
								<td>
									<Image
										alt={`${rsvp.user.name}'s avatar`}
										className="avatar rounded-full border"
										src={rsvp.user.image!}
										height="30"
										width="30"
									/>{" "}
									{rsvp.user.name}
								</td>
								<td>{rsvp.message}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default RsvpTable;

export const RsvpTableFallback = () => {
	return (
		<div className="flex w-full flex-col gap-4">
			<div className="skeleton h-12 w-1/4" />
			<div className="flex justify-around gap-2">
				<div className="skeleton h-16 w-1/3" />
				<div className="skeleton h-16 w-1/3" />
				<div className="skeleton h-16 w-1/3" />
			</div>
			<div className="flex justify-around gap-2">
				<div className="skeleton h-16 w-1/3" />
				<div className="skeleton h-16 w-1/3" />
				<div className="skeleton h-16 w-1/3" />
			</div>
			<div className="justify16around flex gap-2">
				<div className="skeleton h-16 w-1/3" />
				<div className="skeleton h-16 w-1/3" />
				<div className="skeleton h-16 w-1/3" />
			</div>
		</div>
	);
};
