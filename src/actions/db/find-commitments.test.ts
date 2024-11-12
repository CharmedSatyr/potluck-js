import findCommitments from "@/actions/db/find-commitments";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import { commitment } from "@/db/schema/commitment";
import { ZodError } from "zod";

jest.mock("@/db/connection");
jest.mock("@/actions/db/find-event");

describe("findCommitments", () => {
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
		eventCode: "CODE1",
	};

	const mockEvent = [{ id: 1 }];

	const mockCommitment = {
		createdAt: "2024-01-01",
		createdBy: "123e4567-e89b-12d3-a456-426614174000",
		description: "Mock description",
		id: 1,
		quantity: 5,
		slotId: 1,
		updatedAt: "2024-01-02",
	};

	it("should return commitments for valid data", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce(mockEvent);

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					innerJoin: jest.fn().mockResolvedValueOnce([mockCommitment]),
				}),
			}),
		});

		const result = await findCommitments(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.eventCode });
		expect(db.select).toHaveBeenCalledWith({
			createdAt: commitment.createdAt,
			createdBy: commitment.createdBy,
			description: commitment.description,
			id: commitment.id,
			quantity: commitment.quantity,
			slotId: commitment.slotId,
			updatedAt: commitment.updatedAt,
		});
		expect(result).toEqual([mockCommitment]);
	});

	it("should log an error and return an empty array if invalid data is provided", async () => {
		const invalidData = { eventCode: "BAD_CODE" };

		const error = new ZodError([
			{
				code: "too_big",
				maximum: 5,
				type: "string",
				inclusive: true,
				exact: true,
				message: "String must contain exactly 5 character(s)",
				path: ["eventCode"],
			},
		]);

		const result = await findCommitments(invalidData);

		expect(result).toEqual([]);
		expect(findEvent).not.toHaveBeenCalled();
		expect(db.select).not.toHaveBeenCalled();
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array if the event is not found", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([]);

		const result = await findCommitments(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.eventCode });
		expect(result).toEqual([]);
	});

	it("should log an error and return an empty array if the db query fails", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce(mockEvent);

		const error = new Error("DB Error");

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					innerJoin: jest.fn().mockRejectedValueOnce(error),
				}),
			}),
		});

		const result = await findCommitments(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.eventCode });
		expect(db.select).toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});
});
