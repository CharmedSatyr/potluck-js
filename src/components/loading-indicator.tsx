const LoadingIndicator = ({ className = "" }: { className?: string }) => (
	<span className={`loading loading-dots loading-lg ${className}`} />
);

export default LoadingIndicator;
