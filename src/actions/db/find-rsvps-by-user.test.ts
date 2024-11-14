"use server";

import { ZodError } from "zod";
import db from "@/db/connection";
import findRsvpsByUser from "@/actions/db/find-rsvps-by-user";

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

	const validData = { id };
	const invalidData: any = { eventCode: "BAD" };

	it("should return RSVPs for a valid user id", async () => {
		const rsvps = [
			{ id, createdBy: id, eventId: id, response: "yes" },
			{ id, createdBy: id, eventId: id, response: "no" },
			{ id, createdBy: id, eventId: id, response: "yes" },
			{ id, createdBy: id, eventId: id, response: "no" },
		];

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockResolvedValueOnce(rsvps),
			}),
		});

		const result = await findRsvpsByUser(validData);

		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual(rsvps);
	});

	it("should return an empty array and log an error if the event code is invalid", async () => {
		const result = await findRsvpsByUser(validData);

		expect(result).toEqual([]);
	});

	it("should return an empty array and log a ZodError if schema validation fails", async () => {
		const error = new ZodError([
			{
				code: "invalid_type",
				expected: "string",
				received: "undefined",
				path: ["id"],
				message: "Required",
			},
			{
				code: "unrecognized_keys",
				keys: ["eventCode"],
				path: [],
				message: "Unrecognized key(s) in object: 'eventCode'",
			},
		]);

		const result = await findRsvpsByUser(invalidData);

		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db query fails", async () => {
		const error = new Error("DB Error");

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockRejectedValueOnce(error),
			}),
		});

		const result = await findRsvpsByUser(validData);

		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});
});
