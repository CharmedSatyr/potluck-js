const formatIsoTime = (time: string) => {
	if (time === "") {
		return time;
	}

	if (typeof time !== "string" || (time.length !== 5 && time.length !== 8)) {
		console.warn(`Invalid time passed to formatIsoTime: ${String(time)}`);
		return time;
	}

	if (time.length === 8) {
		return time;
	}

	return time.concat(":00");
};

export default formatIsoTime;
