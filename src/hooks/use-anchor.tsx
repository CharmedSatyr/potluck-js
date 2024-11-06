"use client";

import { useEffect, useState } from "react";

const scrollToAnchor = (id: string, query: string = ""): void => {
	const el = document.getElementById(id);
	el?.scrollIntoView({ behavior: "smooth" });
	window.history.pushState(null, "", `${query}#${id}`);
	window.dispatchEvent(
		new HashChangeEvent("hashchange", {
			oldURL: window.location.href,
			newURL: `${window.location.origin}${window.location.pathname}${query}#${id}`,
		})
	);
};

const useAnchor = (): [string, (id: string, query?: string) => void] => {
	const [mounted, setMounted] = useState<boolean>(false);
	const [anchor, setAnchor] = useState<string>("#");

	useEffect(() => {
		if (mounted) {
			return;
		}

		setMounted(true);
		setAnchor(window.location.hash);
	}, [mounted]);

	useEffect(() => {
		if (!mounted) {
			return;
		}

		if (typeof window === "undefined") {
			return;
		}

		const handleAnchorChange = (event: HashChangeEvent) => {
			if (!event.newURL) {
				return;
			}

			setAnchor(new URL(event.newURL).hash);
		};

		window.addEventListener("hashchange", handleAnchorChange, true);

		return () => window.removeEventListener("hashchange", handleAnchorChange);
	}, [mounted]);

	return [anchor.split("#")[1], scrollToAnchor];
};

export default useAnchor;
