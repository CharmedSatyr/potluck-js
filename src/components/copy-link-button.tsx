"use client";

import siteMetadata from "@/data/site-metadata";
import {
	ClipboardDocumentCheckIcon,
    ClipboardDocumentIcon
} from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Props {
	className?: string;
}

const TIME_TO_RESET_SECONDS = 8;

const CopyLinkButton = ({ className }: Props) => {
	const pathName = usePathname();

	const [clicked, setClicked] = useState<boolean>(false);

	const copyUrlToClipboard = (): void => {
		const urlBase =
			process.env.NODE_ENV === "development"
				? window.location.origin
				: siteMetadata.siteUrl;

		navigator.clipboard.writeText(urlBase.concat(pathName));
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
		<ClipboardDocumentCheckIcon className={`size-6 ${className}`} />
	) : (
		<ClipboardDocumentIcon className={`size-6 ${className}`} />
	);

	return (
		<button className="btn btn-ghost" onClick={copyWithReset} type="button">
			{text} {icon}
		</button>
	);
};

export default CopyLinkButton;
