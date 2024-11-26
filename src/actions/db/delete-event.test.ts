import { ZodError } from "zod";
import deleteEvent from "@/actions/db/delete-event";
import db from "@/db/connection";
import { event } from "@/db/schema/event";
import findEvent from "@/actions/db/find-event";

jest.mock("@/db/connection");
jest.mock("@/actions/db/find-event");

describe("deleteEvent", () => {
	let errorLogger: jest.SpyInstance;

	beforeAll(() => {
		errorLogger = jest.spyOn(console, "error").mockImplementation(() => {});
	});

	afterAll(() => {
		errorLogger.mockRestore();
	});

	beforeEach(() => {
		jest.clearAllMocks();
		(findEvent as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);
	});

	const validData = {
		createdBy: "123e4567-e89b-12d3-a456-426614174000",
		code: "CODE1",
	};

	it("should delete an event and return the deleted id on success", async () => {
		(db.delete as jest.Mock).mockReturnValueOnce({
			where: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockResolvedValueOnce([{ id: validData.code }]),
			}),
		});

		const result = await deleteEvent(validData);

		expect(db.delete).toHaveBeenCalledWith(event);
		expect(result).toEqual([{ id: validData.code }]);
	});

	it("should return an empty array and log an error if invalid data is provided", async () => {
		const invalidData = {
			createdBy: "invalid-uuid",
			code: "invalid-code",
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
				maximum: 5,
				type: "string",
				inclusive: true,
				exact: true,
				message: "String must contain exactly 5 character(s)",
				path: ["code"],
			},
		]);

		const result = await deleteEvent(invalidData);

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

		const result = await deleteEvent(validData);

		expect(db.delete).toHaveBeenCalledWith(event);
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});
});
