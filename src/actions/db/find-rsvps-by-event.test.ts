"use server";

import { ZodError } from "zod";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import findRsvpsByEvent from "@/actions/db/find-rsvps-by-event";
import { Rsvp } from "@/db/schema/rsvp";

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

	const id = "605428d7-e305-40c2-8e30-68ead5d7e85b";

	const validData = { eventCode: "CODE1" };

	it("should return slots for a valid event code", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);

		const rsvps = [
			{ id, createdBy: id, eventId: id, response: "attending" },
			{ id, createdBy: id, eventId: id, response: "not attending" },
			{ id, createdBy: id, eventId: id, response: "attending" },
			{ id, createdBy: id, eventId: id, response: "not attending" },
		];

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockResolvedValueOnce(rsvps),
			}),
		});

		const result = await findRsvpsByEvent(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.eventCode });
		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual(rsvps);
	});

	it("should return an empty array and log an error if the event code is invalid", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([]);

		const result = await findRsvpsByEvent(validData);

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

		const result = await findRsvpsByEvent(invalidData);

		expect(result).toEqual([]);
		expect(findEvent).not.toHaveBeenCalled();
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db query fails", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);

		const error = new Error("DB Error");

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockRejectedValueOnce(error),
			}),
		});

		const result = await findRsvpsByEvent(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.eventCode });
		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});
});
