import RequestDetails from "@/app/event/[id]/request-details";
import { Commitment } from "@/db/schema/commitment";
import { Request } from "@/db/schema/food-plan";

interface Props {
	commitments: Commitment[];
	requests: Request[];
}

const RequestManager = ({ commitments, requests }: Props) => {
	return (
		<div>
			<h2>Food Plan</h2>

			<div className="join join-vertical w-full border">
				{requests.map((request, index) => {
					return (
						<div key={request.id} className="join-item border">
							<RequestDetails
								commitments={commitments.filter(
									(c) => c.foodPlanId === request.id
								)}
								index={index}
								request={request}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default RequestManager;
