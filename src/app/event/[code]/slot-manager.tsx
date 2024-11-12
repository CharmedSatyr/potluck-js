import SlotContainer from "@/app/event/[code]/slot-container";
import { User } from "@/db/schema/auth/user";
import { Commitment } from "@/db/schema/commitment";
import { Slot } from "@/db/schema/slot";
import CreateCommitmentForm from "@/app/event/[code]/create-commitment-form";
import CommitmentsTable from "@/app/event/[code]/commitments-table";

type Props = {
	commitments: Commitment[];
	slots: Slot[];
	users: User[];
};

const SlotManager = ({ commitments, slots, users }: Props) => {
	return (
		<div>
			<h2>Food Plan</h2>

			<div className="join join-vertical w-full border">
				{slots.map((slot, index) => {
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

					return (
						<div key={slot.id} className="join-item border">
							<SlotContainer
								course={slot.course}
								commitmentTotal={commitmentTotal}
								slotTotal={slot.count}
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
									commitmentsStillNeeded={
										slot.count - relatedCommitments.length
									}
									index={index}
									slotId={slot.id}
								/>
							</SlotContainer>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SlotManager;
