import { ZodError } from "zod";
import createEvent from "@/actions/db/create-event";
import db from "@/db/connection";
import { event } from "@/db/schema/event";

jest.mock("@/db/connection");

describe("createEvent", () => {
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
		createdBy: "123e4567-e89b-12d3-a456-426614174000",
		description: "This is a valid test event",
		endUtcMs: 1766649600001,
		hosts: "John Doe",
		location: "123 Test St",
		startUtcMs: 1766649600000,
		title: "Test Event",
	};

	it("should insert valid data into the database and return the event code on success", async () => {
		(db.insert as jest.Mock).mockReturnValueOnce({
			values: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockResolvedValueOnce([{ code: "CODE1" }]),
			}),
		});

		const result = await createEvent(validData);

		expect(db.insert).toHaveBeenCalledWith(event);
		expect(result).toEqual([{ code: "CODE1" }]);
	});

	it("should throw an error if invalid data is provided", async () => {
		const invalidData = {
			createdBy: "invalid-uuid",
			description: "This description is too long".repeat(20),
			endUtcMs: 2,
			hosts: "Hosts".repeat(70),
			location: "",
			startUtcMs: 1,
			title: "",
		};

		const error = new ZodError([
			{
				validation: "uuid",
				code: "invalid_string",
				message: "Invalid uuid",
				path: ["createdBy"],
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

		const result = await createEvent(invalidData);

		expect(db.insert).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db insertion fails", async () => {
		const error = new Error("DB Error");
		(db.insert as jest.Mock).mockReturnValueOnce({
			values: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockRejectedValueOnce(error),
			}),
		});

		const result = await createEvent(validData);

		expect(db.insert).toHaveBeenCalledWith(event);
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});
});
