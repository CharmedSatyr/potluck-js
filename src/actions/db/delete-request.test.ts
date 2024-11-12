import { ZodError } from "zod";
import db from "@/db/connection";
import deleteRequest from "@/actions/db/delete-request";
import { request } from "@/db/schema/request";

jest.mock("@/db/connection");

describe("deleteRequest", () => {
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

	it("should delete a request and return the deleted id on success", async () => {
		(db.delete as jest.Mock).mockReturnValueOnce({
			where: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockResolvedValueOnce([{ id: validData.id }]),
			}),
		});

		const result = await deleteRequest(validData);

		expect(db.delete).toHaveBeenCalledWith(request);
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

		const result = await deleteRequest(invalidData);

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

		const result = await deleteRequest(validData);

		expect(db.delete).toHaveBeenCalledWith(request);
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});
});
