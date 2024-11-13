import findEventsByUser from "@/actions/db/find-events-by-user";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteEventButton from "./delete-event-button";
import remove from "@/app/my-events/remove-action";

const MyEvents = async () => {
	const session = await auth();

	if (!session?.user?.id) {
		redirect("/");
	}

	const hosted = await findEventsByUser({ createdBy: session.user.id });

	return (
		<div className="w-full">
			<h1>My Events</h1>

			<h2>Host</h2>
			{!hosted.length ? (
				<div>
					You haven't hosted any events.{" "}
					<Link href="/start">Go throw a party!</Link>
				</div>
			) : (
				<div className="max-h-96 overflow-x-auto">
					<table className="table table-pin-rows table-lg">
						<thead>
							<tr>
								<th></th>
								<th>Code</th>
								<th>Name</th>
								<th>Date</th>
								<th>Time</th>
								<th>Location</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							{hosted
								.toSorted((a, b) =>
									new Date(a.startDate) > new Date(b.startDate) ? -1 : 1
								)
								.map((event) => (
									<tr key={event.id}>
										<td>
											<DeleteEventButton code={event.code} remove={remove} />
										</td>
										<td>
											<Link href={`/event/${event.code}`}>{event.code}</Link>
										</td>
										<td>{event.name}</td>
										<td>{event.startDate}</td>
										<td>{event.startTime}</td>
										<td>{event.location}</td>
										<td>{event.description}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			)}

			<h3>Contributor</h3>
		</div>
	);
};

export default MyEvents;
