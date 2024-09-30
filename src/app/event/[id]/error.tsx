"use client";

import { ArrowPathIcon, HomeModernIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ErrorBoundary = ({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) => {
	useEffect(() => {
		console.error(error);
	}, [error]);

	const { push } = useRouter();

	return (
		<div className="text-center">
			<h2>Something went wrong!</h2>

			<p>Check the event code and try again.</p>

			<button className="btn btn-secondary mb-4 w-full" onClick={reset}>
				<ArrowPathIcon className="size-4" /> Try again
			</button>

			<button className="btn btn-primary w-full" onClick={() => push("/")}>
				<HomeModernIcon className="size-4" /> Go home
			</button>
		</div>
	);
};

export default ErrorBoundary;
