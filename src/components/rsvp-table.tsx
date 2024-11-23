import findRsvpsWithDetails from "@/actions/db/find-rsvps-with-details";
import findUserByEventCode from "@/actions/db/find-user-by-event-code";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type Props = {
	code: string;
};

const RsvpTable = async ({ code }: Props) => {
	const [creator] = await findUserByEventCode({ code });
	<CheckBadgeIcon />;
	const rsvpsWithDetails = [
		{
			id: "1",
			message: (
				<span className="flex items-center gap-1">
					<CheckBadgeIcon className="text-primary" height="20" width="20" />
					Event Host
				</span>
			),
			response: "yes",
			user: { image: creator.image, name: creator.name },
		},
		...(await findRsvpsWithDetails({ code })),
	];

	return (
		<div className="overflow-x-auto">
			<table className="table table-xs">
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
											<div className="badge badge-success badge-sm">
												Attending
											</div>
										) : (
											<div className="badge badge-neutral badge-sm">
												Not Attending
											</div>
										)}
									</label>
								</th>
								<td className="">
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
			<div className="flex justify-around gap-2">
				<div className="skeleton h-8 w-1/3" />
				<div className="skeleton h-8 w-1/3" />
				<div className="skeleton h-8 w-1/3" />
			</div>
			<div className="flex justify-around gap-2">
				<div className="skeleton h-8 w-1/3" />
				<div className="skeleton h-8 w-1/3" />
				<div className="skeleton h-8 w-1/3" />
			</div>
			<div className="flex justify-around gap-2">
				<div className="skeleton h-8 w-1/3" />
				<div className="skeleton h-8 w-1/3" />
				<div className="skeleton h-8 w-1/3" />
			</div>
		</div>
	);
};
