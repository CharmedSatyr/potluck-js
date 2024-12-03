/** Component used for manually testing Suspense fallbacks. */
const IndefiniteSuspense = () => {
	const useIndefiniteSuspense = () => {
		throw new Promise(() => {});
	};

	useIndefiniteSuspense();

	return null;
};

export default IndefiniteSuspense;
