import { suggestionsSchema } from "@/validation/suggestions.schema";
import { z } from "zod";
import { BoltIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const Results = ({
	suggestions,
	reset,
}: {
	suggestions: z.infer<typeof suggestionsSchema>;
	reset: () => void;
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
							{suggestions.items.map((item, i) => (
								<tr key={item.id}>
									<th>{i + 1}</th>
									<td>{item.type}</td>
									<td>{item.count}</td>
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

export default Results;
