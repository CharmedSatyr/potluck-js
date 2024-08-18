const formatIsoTime = (time: string) => {
	if (time.length === 8) {
		return time;
	}

	return time.concat(":00");
};

export default formatIsoTime;
