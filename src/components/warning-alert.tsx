import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type Props = {
	text: string;
};

const WarningAlert = ({ text }: Props) => {
	if (!text) {
		return null;
	}

	return (
		<div role="alert" className="alert mt-2 py-1 text-warning">
			<ExclamationTriangleIcon className="h-6 w-6" />
			<span>{text}</span>
		</div>
	);
};

export default WarningAlert;
