import RequestDetails from "@/app/event/[id]/request-details";
import { User } from "@/db/schema/auth/user";
import { Commitment } from "@/db/schema/commitment";
import { Request } from "@/db/schema/request";

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
					const relatedUsers = new Set(
						relatedCommitments.map((c) => c.createdBy)
					);

					return (
						<div key={request.id} className="join-item border">
							<RequestDetails
								commitments={relatedCommitments}
								index={index}
								request={request}
								users={users.filter((u) => relatedUsers.has(u.id))}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default RequestManager;
