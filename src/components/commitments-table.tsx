import DeleteCommitmentForm from "@/components/slot-manager/delete-commitment-form";
import { auth } from "@/auth";
import Image from "next/image";

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

const CommitmentsTable = async ({ commitmentsWithDetails }: Props) => {
	if (!commitmentsWithDetails?.length) {
		return <p>No plans yet!</p>;
	}

	const session = await auth();

	const singleItem = commitmentsWithDetails.every(
		(c) => c.item === commitmentsWithDetails[0].item
	);

	return (
		<div className="overflow-x-auto">
			<table className="table table-sm md:table-md">
				<thead>
					<tr>
						<th></th>
						<th>User</th>
						{!singleItem && <th>Item</th>}
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
								<td className="flex items-center gap-2">
									<Image
										alt={`${c.user.name}'s Avatar`}
										className="avatar my-0 rounded-full border"
										src={c.user.image!}
										height="20"
										width="20"
									/>{" "}
									{c.user.name}
								</td>
								{!singleItem && <td>{c.item}</td>}
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

export default CommitmentsTable;

export const CommitmentsTableFallback = () => {
	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex justify-around gap-2">
				<div className="skeleton h-8 w-1/3" />
				<div className="skeleton h-8 w-1/3" />
				<div className="skeleton h-8 w-1/3" />
			</div>
			<div className="flex justify-around gap-2">
				<div className="skeleton h-8 w-1/3" />
				<div className="skeleton h-8 w-1/3" />
				<div className="skeleton h-8 w-1/3" />
			</div>
			<div className="flex justify-around gap-2">
				<div className="skeleton h-8 w-1/3" />
				<div className="skeleton h-8 w-1/3" />
				<div className="skeleton h-8 w-1/3" />
			</div>
		</div>
	);
};
