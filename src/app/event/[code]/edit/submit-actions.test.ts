import { updateEventAction } from "@/app/event/[code]/edit/submit-actions";
import { auth } from "@/auth";
import updateEvent from "@/actions/db/update-event";
import {
	formSchema,
	UpdateEventFormState,
} from "@/app/event/[code]/edit/submit-actions.types";
import { revalidatePath } from "next/cache";

// Mock dependencies
jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/actions/db/update-event", () => jest.fn());
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

describe("updateEventAction", () => {
	let prevState: UpdateEventFormState;
	let formData: FormData;

	beforeEach(() => {
		prevState = {
			code: "CODE1",
			fields: {},
			message: "",
			success: false,
		};

		formData = new FormData();
		formData.append("name", "Updated Event Name");
		formData.append("location", "Updated Location");

		(auth as jest.Mock).mockResolvedValue({
			user: { id: "b2c2e71d-c72a-4f8a-bce6-cc89c6a33529" },
		});
		(updateEvent as jest.Mock).mockResolvedValue([{ code: "CODE1" }]);
	});

	it("returns 'No changes detected' if form data contains no changes", async () => {
		const emptyFormData = new FormData();

		const result = await updateEventAction(prevState, emptyFormData);

		expect(result.message).toBe("No changes detected");
		expect(result.success).toBe(true);
	});

	it("returns 'Invalid form data' if form data fails validation", async () => {
		const invalidFormData = new FormData();
		invalidFormData.append("name", "");
		invalidFormData.append("location", "");
		invalidFormData.append("startDate", "1900-01-01");
		invalidFormData.append("startTime", "25:00:00");

		const result = await updateEventAction(prevState, invalidFormData);

		expect(result.message).toBe("Invalid form data");
		expect(result.success).toBe(false);
	});

	it("returns 'Not authenticated' if user is not logged in", async () => {
		(auth as jest.Mock).mockResolvedValue(null);

		const result = await updateEventAction(prevState, formData);
		expect(result.message).toBe("Not authenticated");
		expect(result.success).toBe(false);
	});

	it("calls updateEvent with the correct data when form data is valid", async () => {
		await updateEventAction(prevState, formData);

		expect(updateEvent).toHaveBeenCalledWith({
			...formSchema.parse(Object.fromEntries(formData)),
			code: prevState.code,
			createdBy: "b2c2e71d-c72a-4f8a-bce6-cc89c6a33529",
		});
	});

	it("returns 'Failed to update event' if updateEvent fails", async () => {
		(updateEvent as jest.Mock).mockResolvedValue([null]);

		const result = await updateEventAction(prevState, formData);

		expect(result.message).toBe("Failed to update event");
		expect(result.success).toBe(false);
	});

	it("returns 'Event updated' and revalidates path on successful update", async () => {
		const result = await updateEventAction(prevState, formData);

		expect(result.message).toBe("Event updated");
		expect(result.success).toBe(true);
		expect(revalidatePath).toHaveBeenCalledWith(
			`/event/${prevState.code}`,
			"page"
		);
	});
});
