"use client";

import { useEffect } from "react";

const Error = ({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) => {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div>
			<h2>Something went wrong!</h2>
			<button className="btn btn-primary w-full" onClick={() => reset()}>
				Try again
			</button>
		</div>
	);
};

export default Error;