const LoadingIndicator = () => (
	<>
		<span className="loading loading-ring loading-lg absolute z-50 h-72 w-72 text-accent" />
		<div className="fixed inset-0 bg-black bg-opacity-50" />
	</>
);

export default LoadingIndicator;
