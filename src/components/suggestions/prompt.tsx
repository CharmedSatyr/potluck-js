import LoadingIndicator from "@/components/loading-indicator";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";

type Props = {
	attendees: string;
	fetchSuggestions: () => Promise<void>;
	pending: boolean;
	setAttendees: Dispatch<SetStateAction<string>>;
};

const Prompt = ({
	attendees,
	fetchSuggestions,
	pending,
	setAttendees,
}: Props) => {
	return (
		<aside className="rounded-xl bg-base-300 p-4 text-center md:p-6">
			<h3 className="mb-4 mt-0">Need help planning your meal?</h3>

			<div className="flex items-end justify-center">
				<div className="form-control">
					<label className="label label-text" htmlFor="attendees">
						Estimated attendees
					</label>
					<input
						className="input-text input input-bordered w-40 text-sm sm:text-base"
						disabled={pending}
						id="attendees"
						min={0}
						onChange={(e) => setAttendees(e?.target?.value)}
						type="number"
						value={attendees}
					/>
				</div>

				<button
					className="btn btn-info ml-4 w-28"
					type="button"
					disabled={pending || !attendees || attendees === "0"}
					onClick={fetchSuggestions}
				>
					{pending ? (
						<LoadingIndicator size={6} />
					) : (
						<>
							<SparklesIcon className="size-5" />
							Ask AI
						</>
					)}
				</button>
			</div>
		</aside>
	);
};

export default Prompt;
