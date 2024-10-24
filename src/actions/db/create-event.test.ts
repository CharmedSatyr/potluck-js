import { ZodError, ZodIssueCode } from "zod";
import createEvent from "@/actions/db/create-event";
import db from "@/db/connection";
import { event } from "@/db/schema/event";
import { schema } from "@/actions/db/create-event.types";

jest.mock("@/db/connection");
jest.mock("@/actions/db/create-event.types", () => ({
	schema: {
		parse: jest.fn(),
	},
}));

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
		hosts: "John Doe",
		location: "123 Test St",
		name: "Test Event",
		startDate: "2024-12-31",
		startTime: "12:30:00",
	};

	it("should insert valid data into the database and return the event code on success", async () => {
		(schema.parse as jest.Mock).mockReturnValueOnce(validData);

		(db.insert as jest.Mock).mockReturnValueOnce({
			values: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockResolvedValueOnce([{ code: "CODE1" }]),
			}),
		});

		const result = await createEvent(validData);

		expect(schema.parse).toHaveBeenCalledWith(validData);
		expect(db.insert).toHaveBeenCalledWith(event);
		expect(result).toEqual([{ code: "CODE1" }]);
	});

	it("should throw an error if invalid data is provided", async () => {
		const invalidData = {
			createdBy: "invalid-uuid",
			description: "This description is too long".repeat(20),
			hosts: "Hosts".repeat(70),
			location: "",
			name: "",
			startDate: "1999-12-31",
			startTime: "25:61:00",
		};

		const error = new ZodError([
			{
				path: ["createdBy"],
				message: "Invalid UUID",
				code: ZodIssueCode.invalid_string,
				validation: "uuid",
			},
			{
				path: ["description"],
				message: "Too long",
				code: ZodIssueCode.too_big,
				maximum: 256,
				inclusive: true,
				type: "string",
			},
			{
				path: ["hosts"],
				message: "Too long",
				code: ZodIssueCode.too_big,
				maximum: 256,
				inclusive: true,
				type: "string",
			},
			{
				path: ["location"],
				message: "Location required.",
				code: ZodIssueCode.custom,
			},
			{
				path: ["name"],
				message: "Name required.",
				code: ZodIssueCode.custom,
			},
			{
				path: ["startDate"],
				message: "Date must be within the next year.",
				code: ZodIssueCode.custom,
			},
			{
				path: ["startTime"],
				message: "Time required.",
				code: ZodIssueCode.custom,
			},
		]);

		(schema.parse as jest.Mock).mockImplementationOnce(() => {
			throw error;
		});

		const result = await createEvent(invalidData);

		expect(schema.parse).toHaveBeenCalledWith(invalidData);
		expect(db.insert).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db insertion fails", async () => {
		(schema.parse as jest.Mock).mockReturnValueOnce(validData);

		(db.insert as jest.Mock).mockReturnValueOnce({
			values: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockRejectedValueOnce(new Error("DB Error")),
			}),
		});

		const result = await createEvent(validData);

		expect(schema.parse).toHaveBeenCalledWith(validData);
		expect(db.insert).toHaveBeenCalledWith(event);
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(new Error("DB Error"));
	});
});
