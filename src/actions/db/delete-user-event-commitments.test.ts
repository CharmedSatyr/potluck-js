import deleteUserEventCommitments from "@/actions/db/delete-user-event-commitments";
import db from "@/db/connection";
import findEvent from "@/actions/db/find-event";

jest.mock("@/db/connection");
jest.mock("@/actions/db/find-event", () => jest.fn());

describe("deleteUserEventCommitments", () => {
	const validData = {
		code: "CODE1",
		createdBy: "456e4567-e89b-12d3-a456-426614174000",
	};

	const commitments = [
		{ id: "cced935b-dbd6-4996-872a-39cc5cb2fd97" },
		{ id: "dced935b-dbd7-4996-872a-39cc5cb2fd98" },
	];

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deletes commitments successfully", async () => {
		(findEvent as jest.Mock).mockReturnValueOnce([
			{ id: "123e4567-e89b-12d3-a456-426614174000" },
		]);

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					innerJoin: jest.fn().mockResolvedValueOnce(commitments),
				}),
			}),
		});

		(db.delete as jest.Mock).mockReturnValueOnce({
			where: jest.fn().mockReturnValueOnce({
				returning: jest.fn().mockResolvedValueOnce(commitments),
			}),
		});

		const result = await deleteUserEventCommitments(validData);

		expect(result).toEqual(commitments);
		expect(findEvent).toHaveBeenCalledWith({ code: "CODE1" });
		expect(db.select).toHaveBeenCalled();
		expect(db.delete).toHaveBeenCalled();
	});

	it("returns an empty array if no event is found", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([]);

		const result = await deleteUserEventCommitments(validData);

		expect(result).toEqual([]);
		expect(findEvent).toHaveBeenCalledWith({ code: "CODE1" });
		expect(db.select).not.toHaveBeenCalled();
		expect(db.delete).not.toHaveBeenCalled();
	});

	it("returns an empty array if no commitments match", async () => {
		(findEvent as jest.Mock).mockReturnValueOnce([
			{ id: "123e4567-e89b-12d3-a456-426614174000" },
		]);

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					innerJoin: jest.fn().mockResolvedValueOnce([]),
				}),
			}),
		});

		const result = await deleteUserEventCommitments(validData);

		expect(result).toEqual([]);
		expect(findEvent).toHaveBeenCalledWith({ code: "CODE1" });
		expect(db.select).toHaveBeenCalled();
		expect(db.delete).not.toHaveBeenCalled();
	});

	it("handles database errors gracefully", async () => {
		(findEvent as jest.Mock).mockReturnValueOnce([
			{ id: "123e4567-e89b-12d3-a456-426614174000" },
		]);

		(db.select as jest.Mock).mockReturnValueOnce({
			from: jest.fn().mockReturnValueOnce({
				where: jest.fn().mockReturnValueOnce({
					innerJoin: jest
						.fn()
						.mockRejectedValueOnce(new Error("Database error")),
				}),
			}),
		});

		const result = await deleteUserEventCommitments(validData);

		expect(result).toEqual([]);
		expect(findEvent).toHaveBeenCalledWith({ code: "CODE1" });
		expect(db.select).toHaveBeenCalled();
	});

	it("rejects invalid input", async () => {
		const invalidInput = { code: 123, createdBy: null } as any;

		const result = await deleteUserEventCommitments(invalidInput);

		expect(result).toEqual([]);
		expect(findEvent).not.toHaveBeenCalled();
		expect(db.select).not.toHaveBeenCalled();
		expect(db.delete).not.toHaveBeenCalled();
	});
});
