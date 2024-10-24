import { ZodError, ZodIssueCode } from "zod";
import deleteCommitment from "@/actions/db/delete-commitment";
import db from "@/db/connection";
import { commitment } from "@/db/schema/commitment";
import { schema } from "@/actions/db/delete-commitment.types";

jest.mock("@/db/connection");
jest.mock("@/actions/db/delete-commitment.types", () => ({
	schema: {
		parse: jest.fn(),
	},
}));

describe("deleteCommitment", () => {
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
		id: "456e4567-e89b-12d3-a456-426614174000",
	};

	it("should delete a commitment and return the deleted id on success", async () => {
		(schema.parse as jest.Mock).mockReturnValueOnce(validData);

		(db.delete as jest.Mock).mockReturnValueOnce({
			where: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockResolvedValueOnce([{ id: validData.id }]),
			}),
		});

		const result = await deleteCommitment(validData);

		expect(schema.parse).toHaveBeenCalledWith(validData);
		expect(db.delete).toHaveBeenCalledWith(commitment);
		expect(result).toEqual([{ id: validData.id }]);
	});

	it("should throw an error if invalid data is provided", async () => {
		const invalidData = {
			createdBy: "invalid-uuid",
			id: "invalid-id",
		};

		const error = new ZodError([
			{
				path: ["createdBy"],
				message: "Invalid UUID",
				code: ZodIssueCode.invalid_string,
				validation: "uuid",
			},
			{
				path: ["id"],
				message: "Invalid ID",
				code: ZodIssueCode.invalid_string,
				validation: "uuid",
			},
		]);

		(schema.parse as jest.Mock).mockImplementationOnce(() => {
			throw error;
		});

		const result = await deleteCommitment(invalidData);

		expect(schema.parse).toHaveBeenCalledWith(invalidData);
		expect(db.delete).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db deletion fails", async () => {
		(schema.parse as jest.Mock).mockReturnValueOnce(validData);

		(db.delete as jest.Mock).mockReturnValueOnce({
			where: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockRejectedValueOnce(new Error("DB Error")),
			}),
		});

		const result = await deleteCommitment(validData);

		expect(schema.parse).toHaveBeenCalledWith(validData);
		expect(db.delete).toHaveBeenCalledWith(commitment);
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(new Error("DB Error"));
	});
});
