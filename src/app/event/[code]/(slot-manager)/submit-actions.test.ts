import {
	createCommitmentAction,
	deleteCommitmentAction,
} from "@/app/event/[code]/(slot-manager)/submit-actions";
import { auth } from "@/auth";
import createCommitment from "@/actions/db/create-commitment";
import deleteCommitment from "@/actions/db/delete-commitment";
import { revalidatePath } from "next/cache";
import {
	CreateCommitmentFormState,
	DeleteCommitmentFormState,
	createCommitmentFormSchema,
} from "@/app/event/[code]/(slot-manager)/submit-actions.schema";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/actions/db/create-commitment", () => jest.fn());
jest.mock("@/actions/db/delete-commitment", () => jest.fn());
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

describe("createCommitmentAction", () => {
	let prevState: CreateCommitmentFormState;
	let formData: FormData;

	beforeEach(() => {
		prevState = {
			fields: {},
			message: "",
			path: "/event/test",
			slotId: "slot123",
			success: false,
		};

		formData = new FormData();
		formData.append("code", "CODE1");
		formData.append("name", "Event name");
		formData.append("description", "Commitment description");
		formData.append("description", "Commitment description");
		formData.append("start", "2025-02-09");
		formData.append("time", "12:12");
		formData.append("quantity", "2");

		(auth as jest.Mock).mockResolvedValue({
			user: { id: "b2c2e71d-c72a-4f8a-bce6-cc89c6a33529" },
		});
		(createCommitment as jest.Mock).mockResolvedValue([
			{ id: "b2c2e71d-c72a-4f8a-bce6-cc89c6a33529" },
		]);
	});

	it("returns 'Invalid form data' if form data fails validation", async () => {
		const invalidFormData = new FormData();
		invalidFormData.append("description", "");

		const result = await createCommitmentAction(prevState, invalidFormData);

		expect(result.message).toBe("Invalid form data");
		expect(result.success).toBe(false);
	});

	it("returns 'Not authenticated' if user is not logged in", async () => {
		(auth as jest.Mock).mockResolvedValue(null);

		const result = await createCommitmentAction(prevState, formData);

		expect(result.message).toBe("Not authenticated");
		expect(result.success).toBe(false);
	});

	it("calls createCommitment with correct data when form data is valid", async () => {
		await createCommitmentAction(prevState, formData);

		expect(createCommitment).toHaveBeenCalledWith({
			...createCommitmentFormSchema.parse(Object.fromEntries(formData)),
			createdBy: "b2c2e71d-c72a-4f8a-bce6-cc89c6a33529",
			slotId: prevState.slotId,
		});
	});

	it("returns 'Failed to create event' if createCommitment fails", async () => {
		(createCommitment as jest.Mock).mockResolvedValue([null]);

		const result = await createCommitmentAction(prevState, formData);

		expect(result.message).toBe("Failed to create event");
		expect(result.success).toBe(false);
	});

	it("returns 'Event created' and revalidates path on successful creation", async () => {
		const result = await createCommitmentAction(prevState, formData);

		expect(result.message).toBe("Event created");
		expect(result.success).toBe(true);
		expect(revalidatePath).toHaveBeenCalledWith(prevState.path, "page");
	});
});

describe("deleteCommitmentAction", () => {
	let prevState: DeleteCommitmentFormState;

	beforeEach(() => {
		prevState = {
			commitmentId: "c2c2e71d-c72a-4f8a-bce6-cc89c6a33530",
			message: "",
			path: "/event/test",
			success: false,
		};

		(auth as jest.Mock).mockResolvedValue({
			user: { id: "b2c2e71d-c72a-4f8a-bce6-cc89c6a33529" },
		});
		(deleteCommitment as jest.Mock).mockResolvedValue([
			{ id: "c2c2e71d-c72a-4f8a-bce6-cc89c6a33530" },
		]);
	});

	it("returns 'Missing commitment ID' if commitment ID is not provided", async () => {
		prevState.commitmentId = "";

		const result = await deleteCommitmentAction(prevState, new FormData());

		expect(result.message).toBe("Missing commitment ID");
		expect(result.success).toBe(false);
	});

	it("returns 'Not authenticated' if user is not logged in", async () => {
		(auth as jest.Mock).mockResolvedValue(null);

		const result = await deleteCommitmentAction(prevState, new FormData());

		expect(result.message).toBe("Not authenticated");
		expect(result.success).toBe(false);
	});

	it("calls deleteCommitment with correct data when authenticated", async () => {
		await deleteCommitmentAction(prevState, new FormData());

		expect(deleteCommitment).toHaveBeenCalledWith({
			createdBy: "b2c2e71d-c72a-4f8a-bce6-cc89c6a33529",
			id: prevState.commitmentId,
		});
	});

	it("returns 'Failed to delete commitment' if deleteCommitment fails", async () => {
		(deleteCommitment as jest.Mock).mockResolvedValue([null]);

		const result = await deleteCommitmentAction(prevState, new FormData());

		expect(result.message).toBe("Failed to delete commitment");
		expect(result.success).toBe(false);
	});

	it("returns 'Commitment deleted' and revalidates path on successful deletion", async () => {
		const result = await deleteCommitmentAction(prevState, new FormData());

		expect(result.message).toBe("Commitment deleted");
		expect(result.success).toBe(true);
		expect(revalidatePath).toHaveBeenCalledWith(prevState.path, "page");
	});
});
