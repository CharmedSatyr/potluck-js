import { suggestionsSchema } from "@/validation/suggestions.schema";
import { z } from "zod";
import { BoltIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

const Results = ({
	suggestions,
	reset,
}: {
	suggestions: z.infer<typeof suggestionsSchema>;
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
							{suggestions.items.map((item, i) => (
								<tr key={i}>
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
