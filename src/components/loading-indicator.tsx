const LoadingIndicator = ({ size = 4 }: { size?: number }) => (
	<span className={`loading loading-dots loading-lg size-${size}`} />
);

export default LoadingIndicator;
