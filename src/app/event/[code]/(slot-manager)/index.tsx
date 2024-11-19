import SlotContainer from "@/app/event/[code]/(slot-manager)/slot-container";
import CreateCommitmentForm from "@/app/event/[code]/(slot-manager)/create-commitment-form";
import findSlotContainerDetails from "@/actions/db/find-slot-container-details";
import CommitmentsTable from "@/components/commitments-table";

type Props = {
	code: string;
};

const SlotManager = async ({ code }: Props) => {
	const details = await findSlotContainerDetails({ code });

	return (
		<div className="join join-vertical w-full border">
			{details.map((detail) => {
				const { item, requestedCount, slotId, totalCommitments, users } = detail;

				return (
					<div key={detail.slotId} className="join-item border">
						<SlotContainer
							item={item}
							requestedCount={requestedCount}
							totalCommitments={totalCommitments}
							users={users}
						>
							<label
								className="label label-text ml-2 px-0 pb-2 pt-0"
								htmlFor="commitments-table"
							>
								Current Signups
							</label>

							{totalCommitments > 0 ? (
								<CommitmentsTable code={code} />
							) : (
								<div className="ml-2">
									<p id="commitments-table" className="my-2">
										None yet. Be the first!
									</p>
									<div className="divider"></div>
								</div>
							)}

							{requestedCount - totalCommitments > 0 && (
								<CreateCommitmentForm
									commitmentsStillNeeded={requestedCount - totalCommitments}
									slotId={slotId}
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
