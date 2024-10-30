import formatIsoTime from "@/utilities/format-iso-time";

describe("formatIsoTime", () => {
	it("returns the time unchanged if it is already in ISO format", () => {
		expect(formatIsoTime("12:34:56")).toBe("12:34:56");
		expect(formatIsoTime("23:59:59")).toBe("23:59:59");
	});

	it("returns the time without action if it is a placeholder empty string", () => {
		expect(formatIsoTime("")).toBe("");
	});

	it("appends ':00' if the time is missing seconds (length of 6)", () => {
		expect(formatIsoTime("12:34")).toBe("12:34:00");
		expect(formatIsoTime("23:59")).toBe("23:59:00");
		expect(formatIsoTime("00:00")).toBe("00:00:00");
	});

	it("throws an error if the input is not a string or has an incorrect length", () => {
		expect(() => formatIsoTime("123")).toThrow(
			"Invalid time passed to formatIsoTime"
		);
		expect(() => formatIsoTime("123456789")).toThrow(
			"Invalid time passed to formatIsoTime"
		);
		expect(() => formatIsoTime(123 as unknown as string)).toThrow(
			"Invalid time passed to formatIsoTime"
		);
		expect(() => formatIsoTime(null as unknown as string)).toThrow(
			"Invalid time passed to formatIsoTime"
		);
	});
});
