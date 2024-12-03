import { suggestionsSchema } from "@/validation/suggestions.schema";
import { z } from "zod";
import { BoltIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { SlotData } from "@/@types/slot";

const Results = ({
	populate,
	reset,
	suggestions,
}: {
	populate: (items: SlotData[]) => void;
	reset: () => void;
	suggestions: z.infer<typeof suggestionsSchema>;
}) => {
	const [expanded, setExpanded] = useState<boolean>(true);

	if (!suggestions) {
		return null;
	}

	return (
		<div className="collapse w-full bg-base-300">
			<input
				type="checkbox"
				checked={expanded}
				onChange={() => setExpanded(!expanded)}
			/>

			<div className="collapse-title flex w-full items-center justify-between">
				<div className="flex items-center bg-gradient-to-r from-yellow-100 to-orange-400 bg-clip-text text-xl font-medium text-transparent">
					<BoltIcon className="mr-2 inline size-5 text-yellow-200" />
					Suggestions <div className="badge badge-info ml-2">beta</div>
				</div>
				<div>
					{expanded ? (
						<ChevronUpIcon className="size-5" />
					) : (
						<ChevronDownIcon className="size-5" />
					)}
				</div>
			</div>
			<div className="collapse-content">
				<p>
					<InformationCircleIcon className="mr-2 inline size-6 text-info" />
					{suggestions.advice}
				</p>

				<h3 className="m-0 text-lg">What to Request</h3>
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
							{suggestions.slots.map((slot, i) => (
								<tr key={slot.item}>
									<th>{slot.order}</th>
									<td>{slot.item}</td>
									<td>{slot.count}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="flex w-full justify-between">
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => {
							setExpanded(false);

							populate(suggestions.slots);
						}}
						type="button"
					>
						Use Suggestions
					</button>
					<button
						className="btn btn-warning btn-sm"
						onClick={reset}
						type="button"
					>
						Reset
					</button>
				</div>
			</div>
		</div>
	);
};

export default Results;
