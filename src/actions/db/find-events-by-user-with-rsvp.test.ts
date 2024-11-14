import { ZodError } from "zod";
import findEventsByUserWithRsvp from "@/actions/db/find-events-by-user-with-rsvp";
import db from "@/db/connection";

jest.mock("@/db/connection");

describe("findEventsByUserWithRsvp", () => {
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
		id: "d743bbd0-3e7f-42c7-9e05-4b77f0c7d730",
	};
	const invalidData = {
		id: "",
	};

	it("should find events and return them on success", async () => {
		const data = [
			{ createdBy: validData.id, data: "other" },
			{ createdBy: validData.id, data: "more" },
		];

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					innerJoin: jest.fn().mockReturnValueOnce(data),
				}),
			}),
		});

		const result = await findEventsByUserWithRsvp(validData);

		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual(data);
	});

	it("should throw an error if invalid data is provided", async () => {
		const error = new ZodError([
			{
				validation: "uuid",
				code: "invalid_string",
				message: "Invalid uuid",
				path: ["id"],
			},
		]);

		const result = await findEventsByUserWithRsvp(invalidData);

		expect(db.select).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db retrieval fails", async () => {
		const error = new Error("DB Error");

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					innerJoin: jest.fn().mockRejectedValueOnce(error),
				}),
			}),
		});

		const result = await findEventsByUserWithRsvp(validData);

		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});
});
