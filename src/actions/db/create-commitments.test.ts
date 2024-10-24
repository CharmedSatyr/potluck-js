import { ZodError, ZodIssueCode } from "zod";
import createCommitment from "@/actions/db/create-commitment";
import db from "@/db/connection";
import { commitment } from "@/db/schema/commitment";
import { schema } from "@/actions/db/create-commitment.types";

jest.mock("@/db/connection");
jest.mock("@/actions/db/create-commitment.types", () => ({
	schema: {
		parse: jest.fn(),
	},
}));

describe("createCommitment", () => {
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
		description: "This is a valid test commitment",
		quantity: 10,
		requestId: "123e4567-e89b-12d3-a456-426614174001",
	};

	it("should insert valid data into the database and return the id on success", async () => {
		(schema.parse as jest.Mock).mockReturnValueOnce(validData);

		(db.insert as jest.Mock).mockReturnValueOnce({
			values: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockResolvedValueOnce([{ id: 1 }]),
			}),
		});

		const result = await createCommitment(validData);

		expect(schema.parse).toHaveBeenCalledWith(validData);
		expect(db.insert).toHaveBeenCalledWith(commitment);
		expect(result).toEqual([{ id: 1 }]);
	});

	it("should throw an error if invalid data is provided", async () => {
		const invalidData = {
			createdBy: "invalid-uuid",
			description: "This description is too long".repeat(20),
			quantity: -10,
			requestId: "also-invalid-uuid",
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
				path: ["quantity"],
				message: "Must be a positive number",
				code: ZodIssueCode.too_small,
				minimum: 0,
				inclusive: false,
				type: "number",
			},
			{
				path: ["requestId"],
				message: "Invalid UUID",
				code: ZodIssueCode.invalid_string,
				validation: "uuid",
			},
		]);

		(schema.parse as jest.Mock).mockImplementationOnce(() => {
			throw error;
		});

		const result = await createCommitment(invalidData);

		expect(schema.parse).toHaveBeenCalledWith(invalidData);
		expect(db.insert).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db insertion fails", async () => {
		(schema.parse as jest.Mock).mockReturnValueOnce(validData);

		// Mock db insertion to throw an error
		(db.insert as jest.Mock).mockReturnValueOnce({
			values: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockRejectedValueOnce(new Error("DB Error")),
			}),
		});

		const result = await createCommitment(validData);

		expect(schema.parse).toHaveBeenCalledWith(validData);
		expect(db.insert).toHaveBeenCalledWith(commitment);
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(new Error("DB Error"));
	});
});
