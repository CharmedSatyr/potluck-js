"use client";

import Image from "next/image";
import { PropsWithChildren, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

type Props = {
	commitmentTotal: number;
	item: string;
	requestedCount: number;
	users: {
		commitmentQuantity: number;
		id: string;
		image: string | null;
		name: string | null;
	}[];
};

const Avatars = ({ users }: { users: Props["users"] }) => {
	return users.map((user) =>
		user.image ? (
			<div key={user.id} className="indicator">
				<Image
					alt={`Avatar for user ${user.name}`}
					className="avatar my-0 rounded-full border"
					src={user.image}
					height={40}
					title={`${user.name} is bringing ${user.commitmentQuantity}`}
					width={40}
				/>
				<span className="badge indicator-item badge-primary badge-sm">
					{user.commitmentQuantity}
				</span>
			</div>
		) : (
			<div key={user.id} className="skeleton h-8 w-8 rounded-full border" />
		)
	);
};

const SlotContainer = ({
	children,
	commitmentTotal,
	item,
	requestedCount,
	users,
}: PropsWithChildren<Props>) => {
	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<section className="collapse w-full">
			<input
				type="checkbox"
				checked={expanded}
				onChange={() => setExpanded(!expanded)}
			/>

			<div className="collapse-title flex w-full items-center justify-between">
				<div className="w-6/12 font-bold">{item}</div>

				<Avatars users={users} />

				<div className="flex items-center justify-between">
					{commitmentTotal} of {requestedCount} filled
					{expanded ? (
						<ChevronUpIcon className="-mr-6 ml-2 size-6" />
					) : (
						<ChevronDownIcon className="-mr-6 ml-2 size-6" />
					)}
				</div>
			</div>
			<div className="collapse-content">{children}</div>
		</section>
	);
};

export default SlotContainer;
