const enterToNextRef = (
	event: React.KeyboardEvent<HTMLInputElement>,
	nextRef: React.RefObject<HTMLInputElement | null>
) => {
	if (event.key === "Enter" && nextRef) {
		event.preventDefault(); // Prevent form submission
		nextRef.current?.focus();
	}
};

export default enterToNextRef;
