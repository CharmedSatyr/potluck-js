import updateRequests from "@/actions/db/update-requests";
import findEvent from "@/actions/db/find-event";
import db from "@/db/connection";
import { request } from "@/db/schema/request";
import { ZodError } from "zod";

jest.mock("@/db/connection");
jest.mock("@/actions/db/find-event");

describe("updateRequests", () => {
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

	const id = "8059740a-d6ba-4215-807d-ea5502441bf1";

	const validData: any = {
		code: "CODE1",
		requests: [
			{ count: 5, course: "Apple", id },
			{ count: 3, course: "Banana", id },
		],
	};

	const invalidData: any = {
		code: "CODE1",
		requests: [{ count: 0, course: "" }],
	};

	it("should insert requests into the database and return the created ids on success", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([{ id: "123" }]);

		const returning = [
			{ count: 5, course: "Apple", id },
			{ count: 3, course: "Banana", id },
		];

		(db.insert as jest.Mock).mockReturnValueOnce({
			values: jest.fn().mockReturnValueOnce({
				onConflictDoUpdate: jest.fn().mockReturnValueOnce({
					returning: jest.fn().mockResolvedValueOnce(returning),
				}),
			}),
		});

		const result = await updateRequests(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.code });
		expect(db.insert).toHaveBeenCalledWith(request);
		expect(result).toEqual(returning);
	});

	it("should return an empty array if event is not found", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([]);

		const result = await updateRequests(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.code });
		expect(result).toEqual([]);
	});

	it("should log an error and return an empty array if schema validation fails", async () => {
		const error = new ZodError([
			{
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: false,
				exact: false,
				message: "Number must be greater than 0",
				path: ["requests", 0, "count"],
			},
			{
				code: "too_small",
				minimum: 1,
				type: "string",
				inclusive: true,
				exact: false,
				message: "String must contain at least 1 character(s)",
				path: ["requests", 0, "course"],
			},
			{
				code: "invalid_type",
				expected: "string",
				received: "undefined",
				path: ["requests", 0, "id"],
				message: "Required",
			},
		]);

		const result = await updateRequests(invalidData);

		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should log an error and return an empty array if db insertion fails", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([{ id: "123" }]);

		(db.insert as jest.Mock).mockReturnValueOnce({
			values: jest.fn().mockReturnValueOnce({
				onConflictDoUpdate: jest.fn().mockReturnValueOnce({
					returning: jest.fn().mockRejectedValueOnce(new Error("DB Error")),
				}),
			}),
		});

		const result = await updateRequests(validData);

		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(new Error("DB Error"));
	});
});
