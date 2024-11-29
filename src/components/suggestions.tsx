"use client";

import usePlanFoodSuggestions from "@/hooks/use-plan-food-suggestions";
import { BoltIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import LoadingIndicator from "./loading-indicator";
import { useState } from "react";
import WarningAlert from "./warning-alert";

type Props = {
	name: string;
	description: string;
	hosts: string;
	location: string;
	startDate: string;
	startTime: string;
};

type Suggestions = {
	advice: string;
	dishes: { type: string; count: number }[];
};

const Results = ({
	suggestions,
	reset,
}: {
	suggestions: Suggestions;
	reset: () => void;
}) => {
	if (!suggestions) {
		return null;
	}

	return (
		<div className="collapse w-full bg-base-300">
			<input type="checkbox" />
			<div className="collapse-title bg-gradient-to-r from-yellow-100 to-orange-400 bg-clip-text text-xl font-medium text-transparent">
				<BoltIcon className="mr-2 inline size-5 text-yellow-200" />
				Suggestions
			</div>
			<div className="collapse-content">
				<p>
					<InformationCircleIcon className="mr-2 inline size-6 text-info" />
					{suggestions.advice}
				</p>
				<h3 className="m-0">What to Request:</h3>
				<div className="overflow-x-auto">
					<table className="table table-xs">
						<thead>
							<tr>
								<th></th>
								<th>Type</th>
								<th>Count</th>
							</tr>
						</thead>
						<tbody>
							{suggestions.dishes.map((dish, i) => (
								<tr key={i}>
									<th>{i + 1}</th>
									<td>{dish.type}</td>
									<td>{dish.count}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<button
					className="btn btn-warning btn-sm"
					onClick={reset}
					type="button"
				>
					Reset Suggestions
				</button>
			</div>
		</div>
	);
};

const Suggestions = ({ eventData }: { eventData: Props }) => {
	const [attendees, setAttendees] = useState<string>("0");
	const {
		suggestions: result,
		fetchSuggestions,
		pending,
		reset,
	} = usePlanFoodSuggestions(eventData, Number(attendees));

	// TODO: Use a form/useActionState.

	if (!eventData) {
		return null;
	}

	if (result) {
		try {
			console.log("Result:", typeof result, result);
			const suggestions = JSON.parse(result);
			return <Results suggestions={suggestions} reset={reset} />;
		} catch (err) {
			console.log("Failed to fetch AI suggestions", err);
			return <WarningAlert text={String(err)} />;
		}
	}

	return (
		<aside className="w-fit rounded-xl bg-base-300 p-6 text-center shadow-xl">
			<h3 className="mb-4 mt-0">Need help planning your meal?</h3>

			<div className="flex items-end justify-center">
				<div className="form-control">
					<label className="label label-text">Estimated attendees</label>
					<input
						className="input-text input input-bordered w-48 text-sm sm:text-base"
						onChange={(e) => setAttendees(e?.target?.value)}
						type="number"
						value={attendees}
					/>
				</div>

				<button
					className="w-46 btn btn-info ml-2"
					type="button"
					disabled={pending || !attendees || attendees === "0"}
					onClick={fetchSuggestions}
				>
					{pending ? (
						<LoadingIndicator size={6} />
					) : (
						<>
							<BoltIcon className="size-5" />
							Get AI Suggestions
						</>
					)}
				</button>
			</div>
		</aside>
	);
};

export default Suggestions;
