import SlotContainer from "@/components/slot-manager/slot-container";
import CreateCommitmentForm from "@/components/slot-manager/create-commitment-form";
import findSlotContainerDetails from "@/actions/db/find-slot-container-details";
import CommitmentsTable, {
	CommitmentsTableFallback,
} from "@/components/commitments-table";
import findCommitmentsWithDetails from "@/actions/db/find-commitments-with-details";
import { Suspense } from "react";
import SlideIn from "@/components/slide-in";

type Props = {
	code: string;
};

const SlotManager = async ({ code }: Props) => {
	const commitmentsWithDetails = await findCommitmentsWithDetails({ code });
	const details = await findSlotContainerDetails({ code });

	if (!details?.length) {
		return <div>No plans yet. Ask the host to add some signup slots!</div>;
	}

	return (
		<section className="join join-vertical w-full border">
			{details.map((detail) => {
				const { item, requestedCount, slotId, totalCommitments, users } =
					detail;

				return (
					<div key={slotId} className="join-item border">
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
								<SlideIn>
									<Suspense fallback={<CommitmentsTableFallback />}>
										<CommitmentsTable
											commitmentsWithDetails={commitmentsWithDetails.filter(
												(c) => c.slotId === slotId
											)}
										/>
									</Suspense>
								</SlideIn>
							) : (
								<div className="ml-2">
									<p className="my-2">None yet. Be the first!</p>
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
		</section>
	);
};

export default SlotManager;

export const SlotManagerFallback = () => {
	return (
		<section className="flex w-full flex-col gap-4">
			<div className="flex justify-around gap-2">
				<div className="skeleton h-16 w-1/2" />
				<div className="skeleton h-16 w-16 shrink-0 rounded-full" />
				<div className="skeleton h-16 w-16 shrink-0 rounded-full" />
				<div className="skeleton h-16 w-16 shrink-0 rounded-full" />
				<div className="skeleton h-16 w-1/4" />
			</div>

			<div className="flex justify-around gap-2">
				<div className="skeleton h-16 w-2/3" />
				<div className="skeleton h-16 w-1/3" />
			</div>

			<div className="flex justify-around gap-2">
				<div className="skeleton h-16 w-1/2" />
				<div className="skeleton h-16 w-16 shrink-0 rounded-full" />
				<div className="skeleton h-16 w-16 shrink-0 rounded-full" />
				<div className="skeleton h-16 w-1/4" />
			</div>
		</section>
	);
};
