import upsertRsvp from "@/actions/db/upsert-rsvp";
import findEvent from "@/actions/db/find-event";
import db from "@/db/connection";
import { rsvp } from "@/db/schema/rsvp";
import { ZodError } from "zod";

jest.mock("@/db/connection");
jest.mock("@/actions/db/find-event");

describe("upsertRsvp", () => {
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
		createdBy: id,
		response: "yes",
	};

	const invalidData: any = {
		code: "CODE1",
		slots: [{ count: 0, course: "" }],
	};

	it("should insert an RSVP into the database and return a success object on success", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([{ id: "123" }]);

		const returning = [{ id }];

		(db.insert as jest.Mock).mockReturnValueOnce({
			values: jest.fn().mockReturnValueOnce({
				onConflictDoUpdate: jest.fn().mockReturnValueOnce({
					returning: jest.fn().mockResolvedValueOnce(returning),
				}),
			}),
		});

		const result = await upsertRsvp(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.code });
		expect(db.insert).toHaveBeenCalledWith(rsvp);
		expect(result).toEqual({ success: true });
	});

	it("should return an failure response if event is not found", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([]);

		const result = await upsertRsvp(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.code });
		expect(result).toEqual({ success: false });
	});

	it("should log an error and return an empty array if schema validation fails", async () => {
		const error = new ZodError([
			{
				code: "invalid_type",
				expected: "string",
				received: "undefined",
				path: ["createdBy"],
				message: "Required",
			},
			{
				expected: "'yes' | 'no'",
				received: "undefined",
				code: "invalid_type" as "invalid_literal",
				path: ["response"],
				message: "Required",
			},
			{
				code: "unrecognized_keys",
				keys: ["slots"],
				path: [],
				message: "Unrecognized key(s) in object: 'slots'",
			},
		]);

		const result = await upsertRsvp(invalidData);

		expect(result).toEqual({ success: false });
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

		const result = await upsertRsvp(validData);

		expect(result).toEqual({ success: false });
		expect(errorLogger).toHaveBeenCalledWith(new Error("DB Error"));
	});
});
