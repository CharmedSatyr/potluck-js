import RequestContainer from "@/app/event/[id]/request-container";
import { User } from "@/db/schema/auth/user";
import { Commitment } from "@/db/schema/commitment";
import { Request } from "@/db/schema/request";
import CreateCommitmentForm from "@/app/event/[id]/create-commitment-form";
import CommitmentsTable from "@/app/event/[id]/commitments-table";

type Props = {
	commitments: Commitment[];
	requests: Request[];
	users: User[];
};

const RequestManager = ({ commitments, requests, users }: Props) => {
	return (
		<div>
			<h2>Food Plan</h2>

			<div className="join join-vertical w-full border">
				{requests.map((request, index) => {
					const relatedCommitments = commitments.filter(
						(c) => c.requestId === request.id
					);
					const eventUsers = relatedCommitments.map((c) => c.createdBy);
					const deduplicatedRelatedUsers = new Set(eventUsers);
					const relatedUsers = users
						.filter((u) => deduplicatedRelatedUsers.has(u.id))
						.map((u) => ({ id: u.id, image: u.image, name: u.name }));

					const commitmentTotal = relatedCommitments.reduce(
						(acc, curr) => acc + curr.quantity,
						0
					);

					return (
						<div key={request.id} className="join-item border">
							<RequestContainer
								course={request.course}
								commitmentTotal={commitmentTotal}
								requestTotal={request.count}
								committedUsers={relatedUsers}
							>
								<h3 className="mt-0">Current Signups</h3>
								{commitments.length ? (
									<CommitmentsTable
										commitments={relatedCommitments}
										users={relatedUsers}
									/>
								) : (
									<p>None yet. Be the first!</p>
								)}
								<CreateCommitmentForm
									commitments={relatedCommitments}
									index={index}
									request={request}
									users={relatedUsers}
								/>
							</RequestContainer>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default RequestManager;
