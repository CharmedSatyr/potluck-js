"use client";

import { PropsWithChildren, useState } from "react";
import Image from "next/image";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { User } from "@/db/schema/auth/user";

type Props = {
	course: string;
	committedUsers: Pick<User, "id" | "image" | "name">[];
};

const SlotContainer = ({
	children,
	course,
	committedUsers,
}: PropsWithChildren<Props>) => {
	const [expanded, setExpanded] = useState<boolean>(false);

	const avatars = committedUsers.map((user) =>
		user.image ? (
			<Image
				key={user.id}
				alt={`Avatar for user ${user.name}`}
				className="avatar my-0 rounded-full border"
				src={user.image}
				height={40}
				width={40}
			/>
		) : (
			<div key={user.id} className="skeleton h-8 w-8 rounded-full border" />
		)
	);

	return (
		<div className="collapse w-full">
			<input
				type="checkbox"
				checked={expanded}
				onChange={() => setExpanded(!expanded)}
			/>

			<div className="collapse-title flex w-full items-center justify-between">
				<div className="w-6/12 text-2xl">{course}</div>
				{avatars}
				<div className="flex items-center justify-between">
					{expanded ? (
						<ChevronUpIcon className="-mr-6 ml-2 size-6" />
					) : (
						<ChevronDownIcon className="-mr-6 ml-2 size-6" />
					)}
				</div>
			</div>
			<div className="collapse-content">{children}</div>
		</div>
	);
};

export default SlotContainer;
