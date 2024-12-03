import { TableFallback } from "./page";

const Loading = () => (
	<div className="flex w-full flex-col gap-8">
		<div className="skeleton h-16 w-1/3" />
		<TableFallback />
		<TableFallback />
		<TableFallback />
	</div>
);

export default Loading;
