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
	text: string;
};

const TIME_TO_RESET_SECONDS = 8;

const CopyLinkButton = ({ className, text }: Props) => {
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

	const icon = clicked ? (
		<ClipboardDocumentCheckIcon className={`size-4 ${className}`} />
	) : (
		<ClipboardDocumentIcon className={`size-4 ${className}`} />
	);

	return (
		<div className="tooltip" data-tip={clicked ? "Copied" : "Copy Link"}>
			<button
				className="btn btn-ghost btn-sm text-lg font-bold px-2"
				onClick={copyWithReset}
				type="button"
			>
				<span className="text-secondary">{text}</span> {icon}
			</button>
		</div>
	);
};

export default CopyLinkButton;
