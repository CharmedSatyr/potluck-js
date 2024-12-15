export const formatStartTime = (startTime: string) => {
	const [hours, minutes, seconds] = startTime.split(":").map(Number);
	const date = new Date();
	date.setHours(hours, minutes, seconds);

	const options: Intl.DateTimeFormatOptions = {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};
	const formattedTime = new Intl.DateTimeFormat("en-US", options).format(date);

	return formattedTime;
};
