export const formatStartTime = (startTime: string) => {
	const timeString = "13:00:00";
	const [hours, minutes, seconds] = timeString.split(":").map(Number);
	const date = new Date(0, 0, 0, hours, minutes, seconds); // Create a Date object

	const options: Intl.DateTimeFormatOptions = {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};
	const formattedTime = new Intl.DateTimeFormat("en-US", options).format(date);

	return formattedTime;
};
