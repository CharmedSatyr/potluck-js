import { ZodError } from "zod";
import db from "@/db/connection";
import deleteSlot from "@/actions/db/delete-slot";
import { slot } from "@/db/schema/slot";

jest.mock("@/db/connection");

describe("deleteSlot", () => {
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

	const validData = { id: "456e4567-e89b-12d3-a456-426614174000" };

	it("should delete a slot and return the deleted id on success", async () => {
		(db.delete as jest.Mock).mockReturnValueOnce({
			where: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockResolvedValueOnce([{ id: validData.id }]),
			}),
		});

		const result = await deleteSlot(validData);

		expect(db.delete).toHaveBeenCalledWith(slot);
		expect(result).toEqual([{ id: validData.id }]);
	});

	it("should return an empty array and log an error if invalid data is provided", async () => {
		const invalidData = {
			id: "invalid-id",
		};

		const error = new ZodError([
			{
				validation: "uuid",
				code: "invalid_string",
				message: "Invalid uuid",
				path: ["id"],
			},
		]);

		const result = await deleteSlot(invalidData);

		expect(db.delete).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db deletion fails", async () => {
		const error = new Error("DB Error");

		(db.delete as jest.Mock).mockReturnValueOnce({
			where: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockRejectedValueOnce(error),
			}),
		});

		const result = await deleteSlot(validData);

		expect(db.delete).toHaveBeenCalledWith(slot);
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});
});
