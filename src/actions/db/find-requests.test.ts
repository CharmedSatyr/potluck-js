"use server";

import { ZodError } from "zod";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import findRequests from "@/actions/db/find-requests";

jest.mock("@/db/connection");
jest.mock("@/actions/db/find-event");

describe("findRequests", () => {
	let errorLogger: jest.SpyInstance;

	beforeAll(() => {
		errorLogger = jest.spyOn(console, "error").mockImplementation(() => {});
	});

	afterAll(() => {
		errorLogger.mockRestore();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const validData = { eventCode: "CODE1" };

	it("should return requests for a valid event code", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);

		const mockRequests = [{ id: 101, eventId: 1 }];

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockResolvedValueOnce(mockRequests),
			}),
		});

		const result = await findRequests(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.eventCode });
		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual(mockRequests);
	});

	it("should return an empty array and log an error if the event code is invalid", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([]);

		const result = await findRequests(validData);

		expect(result).toEqual([]);
		expect(findEvent).toHaveBeenCalledWith({ code: validData.eventCode });
	});

	it("should return an empty array and log a ZodError if schema validation fails", async () => {
		const invalidData = { eventCode: "BAD" };

		const error = new ZodError([
			{
				code: "too_small",
				minimum: 5,
				type: "string",
				inclusive: true,
				exact: true,
				message: "String must contain exactly 5 character(s)",
				path: ["eventCode"],
			},
		]);

		const result = await findRequests(invalidData);

		expect(result).toEqual([]);
		expect(findEvent).not.toHaveBeenCalled();
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db query fails", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockRejectedValueOnce(new Error("DB Error")),
			}),
		});

		const result = await findRequests(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.eventCode });
		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(new Error("DB Error"));
	});
});
