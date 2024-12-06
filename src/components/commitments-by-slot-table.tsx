import Image from "next/image";
import { auth } from "@/auth";
import DeleteCommitmentForm from "@/components/slot-manager/delete-commitment-form";

type Props = {
	commitmentsWithDetails: {
		commitmentId: string;
		description: string;
		item: string;
		quantity: number;
		user: {
			id: string | null;
			image: string | null;
			name: string | null;
		};
	}[];
};

const CommitmentsBySlotTable = async ({ commitmentsWithDetails }: Props) => {
	if (!commitmentsWithDetails?.length) {
		return <p>No plans yet!</p>;
	}

	const session = await auth();

	return (
		<div className="mt-0 overflow-x-auto p-0">
			<table className="table table-sm m-0 p-0 md:table-md">
				<thead className="m-0 p-0">
					<tr>
						<th></th>
						<th>User</th>
						<th className="md:hidden">#</th>
						<th className="hidden md:block">Quantity</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{commitmentsWithDetails.map((c) => {
						return (
							<tr key={c.commitmentId}>
								<td>
									{c.user.id === session?.user?.id && (
										<DeleteCommitmentForm id={c.commitmentId} />
									)}
								</td>
								<td>
									<Image
										alt={`${c.user.name}'s Avatar`}
										className="avatar my-0 rounded-full border"
										src={c.user.image!}
										height="20"
										width="20"
									/>{" "}
									{c.user.name}
								</td>
								<td>{c.quantity}</td>
								<td>{c.description}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default CommitmentsBySlotTable;

export const CommitmentsBySlotTableFallback = () => {
	return (
		<div className="flex w-full flex-col gap-4">
			<div className="skeleton h-12 w-1/4" />
			<div className="flex justify-around gap-2">
				<div className="skeleton h-14 w-1/3" />
				<div className="skeleton h-14 w-1/3" />
				<div className="skeleton h-14 w-1/3" />
			</div>
			<div className="justify-4round flex gap-2">
				<div className="skeleton h-14 w-1/3" />
				<div className="skeleton h-14 w-1/3" />
				<div className="skeleton h-14 w-1/3" />
			</div>
			<div className="justify-4round flex gap-2">
				<div className="skeleton h-14 w-1/3" />
				<div className="skeleton h-14 w-1/3" />
				<div className="skeleton h-14 w-1/3" />
			</div>
		</div>
	);
};
