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
	const [anchor, setAnchor] = useState<string>("#");

	const handleHashChange = (hash: string) => {
		if (hash === window.location.hash) {
			return;
		}

		setAnchor(window.location.hash);
	};

	/**
	 * TODO: Find a better way.
	 * hashchange and popstate events don't fire
	 * on next/Form action submit with hash.
	 */
	useEffect(() => {
		const interval = setInterval(() => handleHashChange(anchor), 500);

		return () => clearInterval(interval);
	}, [anchor]);

	return [anchor.split("#")[1], scrollToAnchor];
};

export default useAnchor;
