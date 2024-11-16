export const formatStartDate = (startDate: string) => {
	const date = new Date(startDate);

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	return new Intl.DateTimeFormat("en-US", options).format(date);
};
