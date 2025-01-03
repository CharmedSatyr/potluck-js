import { ZodError } from "zod";
import updateEvent from "@/actions/db/update-event";
import db from "@/db/connection";
import { event } from "@/db/schema/event";

jest.mock("@/db/connection");

describe("updateEvent", () => {
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

	const validData = {
		code: "CODE1",
		description: "Updated description",
		endUtcMs: 1766649600000,
		hosts: "Jane Doe",
		location: "456 Test St",
		startUtcMs: 1766649600000,
		title: "Updated Event",
	};

	it("should update the event in the database and return the updated code on success", async () => {
		(db.update as jest.Mock).mockReturnValueOnce({
			set: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					returning: jest.fn().mockResolvedValueOnce([{ code: "CODE1" }]),
				}),
			}),
		});

		const result = await updateEvent(validData);

		expect(db.update).toHaveBeenCalledWith(event);
		expect(result).toEqual([{ code: "CODE1" }]);
	});

	it("should throw an error if invalid data is provided", async () => {
		const invalidData = {
			code: "BAD",
			description: "This description is too long".repeat(20),
			endUtcMs: 1,
			hosts: "Hosts".repeat(70),
			location: "",
			startUtcMs: 0,
			title: "",
		};

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
			{
				code: "too_big",
				maximum: 256,
				type: "string",
				inclusive: true,
				exact: false,
				message: "String must contain at most 256 character(s)",
				path: ["description"],
			},
			{
				code: "custom",
				message: "Event end must be between 1/3/2025 and 1/3/2026",
				path: ["endUtcMs"],
			},
			{
				code: "too_big",
				maximum: 100,
				type: "string",
				inclusive: true,
				exact: false,
				message: "String must contain at most 100 character(s)",
				path: ["hosts"],
			},
			{
				code: "too_small",
				minimum: 1,
				type: "string",
				inclusive: true,
				exact: false,
				message: "Location required.",
				path: ["location"],
			},
			{
				code: "custom",
				message: "Event start must be between 1/3/2025 and 1/3/2026",
				path: ["startUtcMs"],
			},
			{
				code: "too_small",
				minimum: 1,
				type: "string",
				inclusive: true,
				exact: false,
				message: "Title required.",
				path: ["title"],
			},
		]);

		const result = await updateEvent(invalidData);

		expect(db.update).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db update fails", async () => {
		const error = new Error("DB Error");

		(db.update as jest.Mock).mockReturnValueOnce({
			set: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					returning: jest.fn().mockRejectedValueOnce(error),
				}),
			}),
		});

		const result = await updateEvent(validData);

		expect(db.update).toHaveBeenCalledWith(event);
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});
});
