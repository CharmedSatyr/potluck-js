export const TableFallback = () => (
	<div className="flex w-full flex-col gap-4">
		<div className="skeleton h-12 w-1/4" />
		<div className="flex justify-around gap-2">
			<div className="skeleton h-12 w-2/3" />
			<div className="skeleton h-12 w-1/6" />
			<div className="skeleton h-12 w-1/6" />
		</div>
		<div className="flex justify-around gap-2">
			<div className="skeleton h-12 w-2/3" />
			<div className="skeleton h-12 w-1/6" />
			<div className="skeleton h-12 w-1/6" />
		</div>
		<div className="flex justify-around gap-2">
			<div className="skeleton h-12 w-2/3" />
			<div className="skeleton h-12 w-1/6" />
			<div className="skeleton h-12 w-1/6" />
		</div>
	</div>
);
