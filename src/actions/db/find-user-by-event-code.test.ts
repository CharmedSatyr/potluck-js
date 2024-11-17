import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";
import findUserByEventCode from "@/actions/db/find-user-by-event-code";
import { user as dbUser } from "@/db/schema/auth/user";

jest.mock("@/db/connection");
jest.mock("@/actions/db/find-event");

describe("findUserByEventCode", () => {
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

	const user = { name: "Jane Doe", image: "https://discord.image" };
	const event = {
		code: "CODE1",
		createdBy: "68eeb747-321c-437d-b49c-c10b925b384b",
	};

	it("should return user details when valid data is provided", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([event]);

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockResolvedValueOnce([user]),
			}),
		});

		const result = await findUserByEventCode({ code: "CODE1" });

		expect(findEvent).toHaveBeenCalledWith({ code: "CODE1" });
		expect(db.select).toHaveBeenCalledWith({
			image: dbUser.image,
			name: dbUser.name,
		});
		expect(result).toEqual([user]);
	});

	it("should return an empty array if no event is found", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([]);

		const result = await findUserByEventCode({ code: "BAD99" });

		expect(findEvent).toHaveBeenCalledWith({ code: "BAD99" });
		//expect(db.select).not.toHaveBeenCalled();
		expect(result).toEqual([]);
	});

	it("should return an empty array if schema validation fails", async () => {
		const invalidData = { code: "1" };

		const result = await findUserByEventCode(invalidData);

		expect(findEvent).not.toHaveBeenCalled();
		expect(db.select).not.toHaveBeenCalled();
		expect(result).toEqual([]);
	});

	it("should return an empty array if database query fails", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([event]);

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockRejectedValueOnce(new Error("Database error")),
			}),
		});

		const result = await findUserByEventCode({ code: "CODE1" });

		expect(findEvent).toHaveBeenCalledWith({ code: "CODE1" });
		expect(db.select).toHaveBeenCalledWith({
			image: dbUser.image,
			name: dbUser.name,
		});
		expect(result).toEqual([]);
	});
});
