import SlotContainer from "@/app/event/[code]/(slot-manager)/slot-container";
import CreateCommitmentForm from "@/app/event/[code]/(slot-manager)/create-commitment-form";
import findSlotContainerDetails from "@/actions/db/find-slot-container-details";
import CommitmentsTable from "@/components/commitments-table";

type Props = {
	code: string;
};

const SlotManager = async ({ code }: Props) => {
	const slotContainerDetails = await findSlotContainerDetails({ code });

	return (
		<div className="join join-vertical w-full border">
			{slotContainerDetails.map((detail) => {
				const { commitmentCount, item, requestedCount, slotId, users } = detail;

				return (
					<div key={detail.slotId} className="join-item border">
						<SlotContainer
							commitmentTotal={commitmentCount}
							item={item}
							requestedCount={requestedCount}
							users={users}
						>
							<label
								className="label label-text ml-2 px-0 pb-2 pt-0"
								htmlFor="commitments-table"
							>
								Current Signups
							</label>

							{detail.commitmentCount > 0 ? (
								<CommitmentsTable code={code} />
							) : (
								<div className="ml-2">
									<p id="commitments-table" className="my-2">
										None yet. Be the first!
									</p>
									<div className="divider"></div>
								</div>
							)}

							{requestedCount - commitmentCount > 0 && (
								<CreateCommitmentForm
									commitmentsStillNeeded={requestedCount - commitmentCount}
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
