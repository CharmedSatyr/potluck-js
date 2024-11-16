"use client";

import buildCurrentUrl from "@/utilities/build-current-url";
import {
	ClipboardDocumentCheckIcon,
	ClipboardDocumentIcon,
} from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
	className?: string;
};

const TIME_TO_RESET_SECONDS = 8;

const CopyLinkButton = ({ className }: Props) => {
	const pathName = usePathname();

	const [clicked, setClicked] = useState<boolean>(false);

	const copyUrlToClipboard = (): void => {
		const url = buildCurrentUrl(pathName);
		navigator.clipboard.writeText(url);
	};

	const copyWithReset = () => {
		copyUrlToClipboard();
		setClicked(() => {
			setTimeout(() => setClicked(false), TIME_TO_RESET_SECONDS * 1000);
			return true;
		});
	};

	const text = clicked ? "Copied" : "Copy Link";
	const icon = clicked ? (
		<ClipboardDocumentCheckIcon className={`size-4 ${className}`} />
	) : (
		<ClipboardDocumentIcon className={`size-4 ${className}`} />
	);

	return (
		<button
			className="btn btn-ghost btn-sm"
			onClick={copyWithReset}
			type="button"
		>
			{text} {icon}
		</button>
	);
};

export default CopyLinkButton;
