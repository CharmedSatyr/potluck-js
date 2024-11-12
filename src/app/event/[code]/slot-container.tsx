"use client";

import { PropsWithChildren, Suspense, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

type Props = {
	avatars?: JSX.Element;
	item: string;
};

const SlotContainer = ({
	avatars,
	children,
	item,
}: PropsWithChildren<Props>) => {
	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<div className="collapse w-full">
			<input
				type="checkbox"
				checked={expanded}
				onChange={() => setExpanded(!expanded)}
			/>

			<div className="collapse-title flex w-full items-center justify-between">
				<div className="w-6/12 text-2xl">{item}</div>
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
