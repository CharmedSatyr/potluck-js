"use server";

import { ZodError } from "zod";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import findSlots from "@/actions/db/find-slots";

jest.mock("@/db/connection");
jest.mock("@/actions/db/find-event");

describe("findSlots", () => {
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

	const validData = { code: "CODE1" };

	it("should return slots for a valid event code", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);

		const mockSlots = [{ id: 101, eventId: 1 }];

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					orderBy: jest.fn(() => Promise.resolve(mockSlots)),
				}),
			}),
		});

		const result = await findSlots(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.code });
		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual(mockSlots);
	});

	it("should return an empty array and log an error if the event code is invalid", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([]);

		const result = await findSlots(validData);

		expect(result).toEqual([]);
		expect(findEvent).toHaveBeenCalledWith({ code: validData.code });
	});

	it("should return an empty array and log a ZodError if schema validation fails", async () => {
		const invalidData = { code: "BAD" };

		const error = new ZodError([
			{
				code: "too_small",
				minimum: 5,
				type: "string",
				inclusive: true,
				exact: true,
				message: "String must contain exactly 5 character(s)",
				path: ["code"],
			},
		]);

		const result = await findSlots(invalidData);

		expect(result).toEqual([]);
		expect(findEvent).not.toHaveBeenCalled();
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db query fails", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);

		const error = new Error("DB Error");

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					orderBy: jest.fn().mockRejectedValueOnce(error),
				}),
			}),
		});

		const result = await findSlots(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.code });
		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});
});
