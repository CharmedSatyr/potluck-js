import submitSlots, {
	PlanFoodFormState,
} from "@/components/plan-food-form/submit-actions";
import { redirect } from "next/navigation";
import updateSlots from "@/actions/db/update-slots";

jest.mock("next/navigation");
jest.mock("@/actions/db/update-slots");

describe("submitSlots", () => {
	let prevState: PlanFoodFormState;

	beforeEach(() => {
		prevState = {
			code: "CODE1",
			fields: {},
			message: "",
			success: true,
		};

		(updateSlots as jest.Mock).mockResolvedValue([
			"e444d290-6723-44ed-a90f-5915ce7efcd5",
		]);
	});

	const id = "8059740a-d6ba-4215-807d-ea5502441bf1";

	it("returns an error when the event code is missing", async () => {
		const formData = new FormData();
		prevState.code = "";

		const result = await submitSlots(prevState, formData);

		expect(result.success).toBe(false);
		expect(result.message).toBe(
			"Event code missing. Please refresh the page and try again."
		);
	});

	it("returns an error when schema validation fails", async () => {
		const formData = new FormData();
		formData.append("count-1", "NaN");
		formData.append("id-1", "");
		formData.append("item-1", "");

		const result = await submitSlots(prevState, formData);

		expect(result.success).toBe(false);
		expect(result.message).toBe(
			"There was a problem. Verify entries and try again."
		);
		expect(result.errors).toEqual({
			fieldErrors: {
				slots: [
					"Expected number, received nan",
					"String must contain at least 1 character(s)",
					"Invalid uuid",
				],
			},
			formErrors: [],
		});
		expect(result.fields).toEqual({
			"item-1": "",
			"count-1": "NaN",
			"id-1": "",
		});
	});

	it("returns an error if updateSlots fails to return an ID", async () => {
		const formData = new FormData();
		formData.append("count-1", "3");
		formData.append("id-1", id);
		formData.append("item-1", "Main Course");

		(updateSlots as jest.Mock).mockResolvedValue(null);

		const result = await submitSlots(prevState, formData);

		expect(result.success).toBe(false);
		expect(result.message).toBe("Failed to update slots. Please try again.");
		expect(result.fields).toEqual({
			"item-1": "Main Course",
			"count-1": "3",
			"id-1": id,
		});
	});

	it("calls redirect on successful slot update", async () => {
		const formData = new FormData();
		formData.append("count-1", "2");
		formData.append("id-1", id);
		formData.append("item-1", "Dessert");

		const result = await submitSlots(prevState, formData);

		expect(redirect).toHaveBeenCalledWith(`/event/${prevState.code}`);
		expect(result).toBeUndefined();
	});

	it("handles form data without required fields gracefully", async () => {
		const formData = new FormData();

		const result = await submitSlots(prevState, formData);

		expect(result.success).toBe(false);
		expect(result.message).toBe(
			"There was a problem. Verify entries and try again."
		);
		expect(result.errors).toBeDefined();
	});
});
