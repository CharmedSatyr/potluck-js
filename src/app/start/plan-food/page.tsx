"use client";

import { useRouter, useSearchParams } from "next/navigation";

const PlanFoodPage = () => {
	const { push, replace } = useRouter();
	const searchParams = useSearchParams();

	const shortId = searchParams.get("event");

	if (!shortId) {
		replace(`/start`);
	}

	return (
		<div>
			<div>TODO: Plan the Food!</div>
			<button
				className="btn btn-primary"
				onClick={() => push(`/party/${shortId}`)}
			>
				Submit
			</button>
		</div>
	);
};

export default PlanFoodPage;
