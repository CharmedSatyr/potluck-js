import { ZodError } from "zod";
import createCommitment from "@/actions/db/create-commitment";
import db from "@/db/connection";
import { commitment } from "@/db/schema/commitment";

jest.mock("@/db/connection");

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
		(db.insert as jest.Mock).mockReturnValueOnce({
			values: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockResolvedValueOnce([{ id: 1 }]),
			}),
		});

		const result = await createCommitment(validData);

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
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: false,
				exact: false,
				message: "Number must be greater than 0",
				path: ["quantity"],
			},
			{
				validation: "uuid",
				code: "invalid_string",
				message: "Invalid uuid",
				path: ["requestId"],
			},
		]);

		const result = await createCommitment(invalidData);

		expect(db.insert).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db insertion fails", async () => {
		(db.insert as jest.Mock).mockReturnValueOnce({
			values: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockRejectedValueOnce(new Error("DB Error")),
			}),
		});

		const result = await createCommitment(validData);

		expect(db.insert).toHaveBeenCalledWith(commitment);
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(new Error("DB Error"));
	});
});
