import { ZodError } from "zod";
import deleteCommitment from "@/actions/db/delete-commitment";
import db from "@/db/connection";
import { commitment } from "@/db/schema/commitment";

jest.mock("@/db/connection");

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
		(db.delete as jest.Mock).mockReturnValueOnce({
			where: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockResolvedValueOnce([{ id: validData.id }]),
			}),
		});

		const result = await deleteCommitment(validData);

		expect(db.delete).toHaveBeenCalledWith(commitment);
		expect(result).toEqual([{ id: validData.id }]);
	});

	it("should return an empty array and log an error if invalid data is provided", async () => {
		const invalidData = {
			createdBy: "invalid-uuid",
			id: "invalid-id",
		};

		const error = new ZodError([
			{
				validation: "uuid",
				code: "invalid_string",
				message: "Invalid uuid",
				path: ["createdBy"],
			},
			{
				validation: "uuid",
				code: "invalid_string",
				message: "Invalid uuid",
				path: ["id"],
			},
		]);

		const result = await deleteCommitment(invalidData);

		expect(db.delete).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db deletion fails", async () => {
		(db.delete as jest.Mock).mockReturnValueOnce({
			where: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockRejectedValueOnce(new Error("DB Error")),
			}),
		});

		const result = await deleteCommitment(validData);

		expect(db.delete).toHaveBeenCalledWith(commitment);
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(new Error("DB Error"));
	});
});
