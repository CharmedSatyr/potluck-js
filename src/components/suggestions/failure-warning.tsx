import WarningAlert from "@/components/warning-alert";

const FailureWarning = ({
	errorMessage,
	reset,
}: {
	errorMessage?: string;
	reset: () => void;
}) => (
	<>
		<WarningAlert text={errorMessage} />
		<button className="btn btn-warning btn-sm" onClick={reset} type="button">
			Reset Suggestions
		</button>
	</>
);

export default FailureWarning;
