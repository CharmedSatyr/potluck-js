"use client";

import Image from "next/image";
import { PropsWithChildren, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

type Props = {
	item: string;
	requestedCount: number;
	totalCommitments: number;
	users: {
		id: string;
		image: string | null;
		name: string | null;
		commitments: number;
	}[];
};

const Avatars = ({ users }: { users: Props["users"] }) => {
	return users.map(({ id, image, name, commitments }) =>
		image ? (
			<div key={id} className="indicator">
				<Image
					alt={`Avatar for user ${name}`}
					className="avatar my-0 size-8 rounded-full border"
					src={image} // TODO: Use a static import
					height={40}
					title={`${name} is bringing ${commitments}`}
					width={40}
				/>
				<span className="badge indicator-item badge-primary badge-sm">
					{commitments}
				</span>
			</div>
		) : (
			<div key={id} className="skeleton h-8 w-8 rounded-full border" />
		)
	);
};

const SlotContainer = ({
	children,
	item,
	requestedCount,
	totalCommitments,
	users,
}: PropsWithChildren<Props>) => {
	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<section className="collapse w-full">
			<input
				aria-label="expand-slot-container"
				type="checkbox"
				checked={expanded}
				onChange={() => setExpanded(!expanded)}
			/>

			<div className="collapse-title flex w-full items-center justify-between">
				<div className="md:w-6/12">{item}</div>

				<div className="hidden sm:flex sm:gap-4">
					<Avatars users={users} />
				</div>

				<div className="flex items-center justify-between text-sm md:text-base">
					{totalCommitments} of {requestedCount} filled
					{expanded ? (
						<ChevronUpIcon className="-mr-6 ml-2 size-4" />
					) : (
						<ChevronDownIcon className="-mr-6 ml-2 size-4" />
					)}
				</div>
			</div>
			<div className="collapse-content">{children}</div>
		</section>
	);
};

export default SlotContainer;
