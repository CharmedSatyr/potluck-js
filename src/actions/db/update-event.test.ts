import { ZodError } from "zod";
import updateEvent from "@/actions/db/update-event";
import db from "@/db/connection";
import { event } from "@/db/schema/event";
import findEvent from "@/actions/db/find-event";

jest.mock("@/db/connection");
jest.mock("@/actions/db/find-event");

describe("updateEvent", () => {
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
		createdBy: "123e4567-e89b-12d3-a456-426614174000",
		description: "Updated description",
		hosts: "Jane Doe",
		location: "456 Test St",
		name: "Updated Event",
		startDate: "2024-12-31",
		startTime: "14:00:00",
	};

	it("should update the event in the database and return the updated code on success", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);

		(db.update as jest.Mock).mockReturnValueOnce({
			set: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					returning: jest.fn().mockResolvedValueOnce([{ code: "CODE1" }]),
				}),
			}),
		});

		const result = await updateEvent(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.code });
		expect(db.update).toHaveBeenCalledWith(event);
		expect(result).toEqual([{ code: "CODE1" }]);
	});

	it("should throw an error if invalid data is provided", async () => {
		const invalidData = {
			code: "BAD",
			createdBy: "invalid-uuid",
			description: "This description is too long".repeat(20),
			hosts: "Hosts".repeat(70),
			location: "",
			name: "",
			startDate: "1999-12-31",
			startTime: "25:61:00",
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
			{
				validation: "uuid",
				code: "invalid_string",
				message: "Invalid uuid",
				path: ["createdBy"],
			},
			{
				code: "too_big",
				maximum: 256,
				type: "string",
				inclusive: true,
				exact: false,
				message: "String must contain at most 256 character(s)",
				path: ["description"],
			},
			{
				code: "too_big",
				maximum: 256,
				type: "string",
				inclusive: true,
				exact: false,
				message: "String must contain at most 256 character(s)",
				path: ["hosts"],
			},
			{
				code: "too_small",
				minimum: 1,
				type: "string",
				inclusive: true,
				exact: false,
				message: "Location required.",
				path: ["location"],
			},
			{
				code: "too_small",
				minimum: 1,
				type: "string",
				inclusive: true,
				exact: false,
				message: "Name required.",
				path: ["name"],
			},
			{
				code: "custom",
				message: "Date must be within the next year.",
				path: ["startDate"],
			},
			{
				code: "custom",
				message: "Time required.",
				path: ["startTime"],
			},
		]);

		const result = await updateEvent(invalidData);

		expect(db.update).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if db update fails", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);

		const error = new Error("DB Error");

		(db.update as jest.Mock).mockReturnValueOnce({
			set: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					returning: jest.fn().mockRejectedValueOnce(error),
				}),
			}),
		});

		const result = await updateEvent(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.code });
		expect(db.update).toHaveBeenCalledWith(event);
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});
});