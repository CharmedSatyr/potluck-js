import { z } from "zod";
import findUserIdByProviderAccountId from "@/actions/db/find-user-id-by-provider-account-id";
import db from "@/db/connection";
import { schema } from "@/actions/db/find-user-id-by-provider-account-id.schema";

jest.mock("@/db/connection", () => ({
	select: jest.fn(),
}));

describe("findUserIdByProviderAccountId", () => {
	const id = "4a44ed5a-fd4a-4a16-bddc-4aef1b175899";
	const validInput: z.infer<typeof schema> = {
		providerAccountId: "valid-provider-id",
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("returns user ID when a matching account is found", async () => {
		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockResolvedValueOnce([{ id }]),
			}),
		});

		const result = await findUserIdByProviderAccountId(validInput);

		expect(result).toEqual([{ id }]);
		expect(db.select).toHaveBeenCalledWith({ id: expect.anything() });
	});

	it("returns an empty array when no matching account is found", async () => {
		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockResolvedValueOnce([]),
			}),
		} as any);

		const result = await findUserIdByProviderAccountId(validInput);

		expect(result).toEqual([]);
		expect(db.select).toHaveBeenCalledWith({ id: expect.anything() });
	});

	it("logs an error and returns an empty array on database error", async () => {
		const consoleSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockRejectedValueOnce(new Error("Database error")),
			}),
		});

		const result = await findUserIdByProviderAccountId(validInput);

		expect(result).toEqual([]);
		expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
		expect(db.select).toHaveBeenCalledWith({ id: expect.anything() });

		consoleSpy.mockRestore();
	});
});
