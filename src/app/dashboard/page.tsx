import findEventsByUser from "@/actions/db/find-events-by-user";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteEventButton from "./delete-event-button";
import remove from "@/app/dashboard/remove-action";
import eventIsPassed from "@/utilities/event-is-passed";

const Dashboard = async () => {
	const session = await auth();

	if (!session?.user?.id) {
		redirect("/");
	}

	const hosted = await findEventsByUser({ createdBy: session.user.id });

	return (
		<div className="w-full">
			<h1>Dashboard</h1>

			<h2>Events You Created</h2>
			{!hosted.length ? (
				<div>
					You haven&apos;t hosted any events.{" "}
					<Link href="/start">Go throw a party!</Link>
				</div>
			) : (
				<div className="max-h-96 overflow-x-auto">
					<table className="table table-pin-rows table-lg">
						<thead>
							<tr>
								<th></th>
								<th>Status</th>
								<th>Name</th>
								<th>Date</th>
								<th>Location</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{hosted
								.sort((a, b) =>
									new Date(a.startDate) > new Date(b.startDate) ? -1 : 1
								)
								.map((event) => {
									const passed = eventIsPassed(event.startDate);

									return (
										<tr key={event.id} className={passed ? "bg-base-300" : ""}>
											<td>
												<DeleteEventButton code={event.code} remove={remove} />
											</td>
											<td>
												{passed ? (
													<span className="text-error">Past</span>
												) : (
													<span className="text-success">Active</span>
												)}
											</td>
											<td>{event.name}</td>
											<td>{event.startDate}</td>
											<td>{event.location}</td>
											<td>
												<Link
													className="btn btn-sm"
													href={`/event/${event.code}`}
												>
													Details
												</Link>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			)}

			<h3>Events You Attended</h3>
			<p>Coming Soon</p>
		</div>
	);
};

export default Dashboard;
