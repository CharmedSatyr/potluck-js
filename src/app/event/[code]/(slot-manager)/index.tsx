import { use } from "react";
import SlotContainer from "@/app/event/[code]/(slot-manager)/slot-container";
import CommitmentsTable from "@/app/event/[code]/(slot-manager)/commitments-table";
import { Commitment } from "@/db/schema/commitment";
import { Slot } from "@/db/schema/slot";
import { User } from "@/db/schema/auth/user";
import CreateCommitmentForm from "./create-commitment-form";

type Props = {
	commitments: Commitment[];
	committedUsersBySlotPromise: Promise<Map<string, JSX.Element>>;
	slots: Slot[];
	users: User[];
};

const SlotManager = ({
	committedUsersBySlotPromise,
	commitments,
	slots,
	users,
}: Props) => {
	const committedUsersBySlot = use(committedUsersBySlotPromise);

	return (
		<div className="join join-vertical w-full border">
			{slots.map((slot) => {
				const relatedCommitments = commitments.filter(
					(c) => c.slotId === slot.id
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

				const commitmentsStillNeeded = slot.count - relatedCommitments.length;

				return (
					<div key={slot.id} className="join-item border">
						<SlotContainer
							avatars={committedUsersBySlot.get(slot.id)}
							commitmentTotal={commitmentTotal}
							item={slot.course}
							slotCount={slot.count}
						>
							<label
								className="label label-text ml-2 px-0 pb-2 pt-0"
								htmlFor="commitments-table"
							>
								Current Signups
							</label>
							{relatedCommitments.length > 0 ? (
								<CommitmentsTable
									commitments={relatedCommitments}
									users={relatedUsers}
								/>
							) : (
								<div className="ml-2">
									<p id="commitments-table" className="my-2">
										None yet. Be the first!
									</p>
									<div className="divider"></div>
								</div>
							)}
							{commitmentsStillNeeded > 0 && (
								<CreateCommitmentForm
									commitmentsStillNeeded={commitmentsStillNeeded}
									slotId={slot.id}
								/>
							)}
						</SlotContainer>
					</div>
				);
			})}
		</div>
	);
};

export default SlotManager;
