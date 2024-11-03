import { useEffect, useState } from "react";

const useAnchor = (): [string] => {
	const [mounted, setMounted] = useState<boolean>(false);
	const [anchor, setAnchor] = useState<string>("#");

	useEffect(() => {
		if (mounted) {
			return;
		}

		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) {
			return;
		}

		if (typeof window === "undefined") {
			return;
		}

		const handleAnchorChange = (event: HashChangeEvent) => {
			setAnchor(event.newURL ?? event.oldURL);
		};

		window.addEventListener("hashchange", handleAnchorChange);

		return () => window.removeEventListener("hashchange", handleAnchorChange);
	}, [mounted]);

	return [anchor.split("#")[1]];
};

export default useAnchor;
