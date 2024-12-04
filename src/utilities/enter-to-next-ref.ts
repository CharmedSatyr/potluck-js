const enterToNextRef = (
	event: React.KeyboardEvent<HTMLInputElement>,
	nextRef: React.RefObject<HTMLInputElement>
) => {
	if (event.key === "Enter") {
		event.preventDefault(); // Prevent form submission
		nextRef.current?.focus();
	}
};

export default enterToNextRef;
