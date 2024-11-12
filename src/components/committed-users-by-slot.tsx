"use server";

import findCommitments from "@/actions/db/find-commitments";
import findSlots from "@/actions/db/find-slots";
import findUsers from "@/actions/db/find-users";
import { User } from "@/db/schema/auth/user";
import Image from "next/image";

type Props = {
	committedUsers: Pick<User, "id" | "image" | "name">[];
};

const Avatars = ({ committedUsers }: Props) => {
	return committedUsers.map((user) =>
		user.image ? (
			<Image
				key={user.id}
				alt={`Avatar for user ${user.name}`}
				className="avatar my-0 rounded-full border"
				src={user.image}
				height={40}
				title={user.name ?? ""}
				width={40}
			/>
		) : (
			<div key={user.id} className="skeleton h-8 w-8 rounded-full border" />
		)
	);
};

const committedUsersBySlot = async (
	code: string
): Promise<Map<string, JSX.Element>> => {
	if (!code) {
		return new Map();
	}

	const slots = await findSlots({ eventCode: code });
	const commitments = await findCommitments({ eventCode: code });
	const usersToFind = commitments.map((c) => c.createdBy);

	if (usersToFind.length === 0) {
		return new Map();
	}

	const users = await findUsers({
		users: usersToFind as [string, ...string[]],
	});

	const map = new Map();

	slots.forEach((slot) => {
		const relatedCommitments = commitments.filter((c) => c.slotId === slot.id);
		const eventUsers = relatedCommitments.map((c) => c.createdBy);
		const deduplicatedRelatedUsers = new Set(eventUsers);
		const committedUsers = users
			.filter((u) => deduplicatedRelatedUsers.has(u.id))
			.map((u) => ({
				id: u.id,
				image: u.image,
				name: u.name,
			}));

		if (!committedUsers.length) {
			return;
		}

		map.set(slot.id, <Avatars committedUsers={committedUsers} />);
	});

	return map;
};

export default committedUsersBySlot;
