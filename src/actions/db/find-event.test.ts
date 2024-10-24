import { ZodError, ZodIssueCode } from "zod";
import findEvent from "@/actions/db/find-event";
import db from "@/db/connection";
import { schema } from "@/actions/db/find-event.types";

jest.mock("@/db/connection");
jest.mock("@/actions/db/find-event.types", () => ({
	schema: {
		parse: jest.fn(),
	},
}));

describe("findEvent", () => {
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
		code: "CODE1",
	};

	it("should find an event and return it on success", async () => {
		(schema.parse as jest.Mock).mockReturnValueOnce(validData);

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					limit: jest.fn().mockResolvedValueOnce([{ code: validData.code }]),
				}),
			}),
		});

		const result = await findEvent(validData);

		expect(schema.parse).toHaveBeenCalledWith(validData);
		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual([{ code: validData.code }]);
	});

	it("should throw an error if invalid data is provided", async () => {
		const invalidData = {
			code: "",
		};

		const error = new ZodError([
			{
				path: ["code"],
				message: "Code required.",
				code: ZodIssueCode.custom,
			},
		]);

		(schema.parse as jest.Mock).mockImplementationOnce(() => {
			throw error;
		});

		const result = await findEvent(invalidData);

		expect(schema.parse).toHaveBeenCalledWith(invalidData);
		expect(db.select).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db retrieval fails", async () => {
		(schema.parse as jest.Mock).mockReturnValueOnce(validData);

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					limit: jest.fn().mockRejectedValueOnce(new Error("DB Error")),
				}),
			}),
		});

		const result = await findEvent(validData);

		expect(schema.parse).toHaveBeenCalledWith(validData);
		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(new Error("DB Error"));
	});
});
