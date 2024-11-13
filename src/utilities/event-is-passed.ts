const eventIsPassed = (startDate: string) => {
	return new Date(startDate) < new Date();
};

export default eventIsPassed;
