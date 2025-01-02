import { ZodError } from "zod";
import findUsers from "@/actions/db/find-users";
import db from "@/db/connection";
import { user } from "@/db/schema/auth/user";

jest.mock("@/db/connection");

describe("findUsers", () => {
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

	const validData: { users: [string, ...string[]] } = {
		users: [
			"123e4567-e89b-12d3-a456-426614174000",
			"987e6543-a21c-45f7-b654-876543210000",
		],
	};

	it("should return the users from the database when valid data is provided", async () => {
		const response = [
			{
				id: "123e4567-e89b-12d3-a456-426614174000",
				image: "https://user1.img",
				name: "User One",
			},
			{
				id: "987e6543-a21c-45f7-b654-876543210000",
				image: "https://user2.img",
				name: "User Two",
			},
		];

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockResolvedValueOnce(response),
			}),
		});

		const result = await findUsers(validData);

		expect(db.select).toHaveBeenCalledWith({
			id: user.id,
			image: user.image,
			name: user.name,
		});
		expect(result).toEqual(response);
	});

	it("should return an empty array and log an error if invalid data is provided", async () => {
		const invalidData: { users: [string, ...string[]] } = {
			users: ["invalid-uuid"],
		};

		const error = new ZodError([
			{
				validation: "uuid",
				code: "invalid_string",
				message: "Invalid uuid",
				path: ["users", 0],
			},
		]);

		const result = await findUsers(invalidData);

		expect(db.select).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if no users are provided", async () => {
		const emptyData = { users: [] } as unknown as {
			users: [string, ...string[]];
		};

		const error = new ZodError([
			{
				code: "too_small",
				minimum: 1,
				type: "array",
				inclusive: true,
				exact: false,
				message: "Array must contain at least 1 element(s)",
				path: ["users"],
			},
		]);

		const result = await findUsers(emptyData);

		expect(db.select).not.toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});

	it("should return an empty array and log an error if the database query fails", async () => {
		const error = new Error("DB Error");

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockRejectedValueOnce(error),
			}),
		});

		const result = await findUsers(validData);

		expect(db.select).toHaveBeenCalledWith({
			id: user.id,
			image: user.image,
			name: user.name,
		});
		expect(result).toEqual([]);
		expect(errorLogger).toHaveBeenCalledWith(error);
	});
});
