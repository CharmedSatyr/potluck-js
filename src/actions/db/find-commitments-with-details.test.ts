import findCommitmentsWithDetails from "@/actions/db/find-commitments-with-details";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import { commitment } from "@/db/schema/commitment";
import { slot } from "@/db/schema/slot";
import { user } from "@/db/schema/auth/user";

jest.mock("@/db/connection", () => ({
	select: jest.fn(),
}));
jest.mock("@/actions/db/find-event");

describe("findCommitmentsWithDetails", () => {
	let errorLogger: jest.SpyInstance;

	beforeAll(() => {
		errorLogger = jest.spyOn(console, "error").mockImplementation(() => {});
	});

	afterAll(() => {
		errorLogger.mockRestore();
	});

	const validData = { code: "CODE1" };
	const event = { id: 1 };
	const commitmentsWithDetails = [
		{
			commitmentId: 1,
			description: "Bring cookies",
			item: "Snickerdoodles",
			quantity: 12,
			slotId: "7e6c6edd-abe0-4001-aeab-764ee74cd33e",
			user: {
				id: "7e6c6edd-abe0-4001-aeab-764ee74cd33e",
				image: "https://example.com/avatar.png",
				name: "Test User",
			},
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();

		(db.select as jest.Mock).mockImplementation(() => ({
			from: jest.fn(() => ({
				where: jest.fn(() => ({
					innerJoin: jest.fn(() => ({
						innerJoin: jest.fn(() => Promise.resolve(commitmentsWithDetails)),
					})),
				})),
			})),
		}));
	});

	it("should validate the input and process valid data", async () => {
		(findEvent as jest.Mock).mockResolvedValue([event]);

		const result = await findCommitmentsWithDetails(validData);

		expect(db.select).toHaveBeenCalledWith({
			commitmentId: commitment.id,
			description: commitment.description,
			item: slot.item,
			quantity: commitment.quantity,
			slotId: slot.id,
			user: {
				id: user.id,
				image: user.image,
				name: user.name,
			},
		});
		expect(result).toEqual(commitmentsWithDetails);
	});

	it("should return an empty array for invalid input", async () => {
		const invalidData = { invalidKey: "1" };

		await expect(
			findCommitmentsWithDetails(invalidData as any)
		).resolves.toEqual([]);
	});

	it("should return an empty array if the event is not found", async () => {
		(findEvent as jest.Mock).mockResolvedValue([]);

		const result = await findCommitmentsWithDetails(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.code });
		expect(result).toEqual([]);
	});

	it("should return an empty array if the query fails", async () => {
		(findEvent as jest.Mock).mockRejectedValue(new Error("Query failed"));

		const result = await findCommitmentsWithDetails(validData);

		expect(findEvent).toHaveBeenCalledWith({ code: validData.code });
		expect(result).toEqual([]);
	});
});
