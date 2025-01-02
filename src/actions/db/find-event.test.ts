import { ZodError } from "zod";
import findEvent from "@/actions/db/find-event";
import db from "@/db/connection";

jest.mock("@/db/connection");

describe("findEvent", () => {
	let warnLogger: jest.SpyInstance;

	beforeAll(() => {
		warnLogger = jest.spyOn(console, "warn").mockImplementation(() => {});
	});

	afterAll(() => {
		warnLogger.mockRestore();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const validData = {
		code: "CODE1",
	};

	it("should find an event and return it on success", async () => {
		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					limit: jest.fn().mockResolvedValueOnce([{ code: validData.code }]),
				}),
			}),
		});

		const result = await findEvent(validData);

		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual([{ code: validData.code }]);
	});

	it("should throw an error if invalid data is provided", async () => {
		const invalidData = {
			code: "",
		};

		const error = new ZodError([
			{
				code: "too_small",
				minimum: 5,
				type: "string",
				inclusive: true,
				exact: true,
				message: "String must contain exactly 5 character(s)",
				path: ["code"],
			},
		]);

		const result = await findEvent(invalidData);

		expect(db.select).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(warnLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db retrieval fails", async () => {
		const error = new Error("DB Error");

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					limit: jest.fn().mockRejectedValueOnce(error),
				}),
			}),
		});

		const result = await findEvent(validData);

		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(warnLogger).toHaveBeenCalledWith(error);
	});
});
