import submitRequest, {
	PlanFoodFormState,
} from "@/components/plan-food-form/submit-actions";
import createRequest from "@/actions/db/create-request";
import { redirect } from "next/navigation";

jest.mock("@/actions/db/create-request");
jest.mock("next/navigation");

describe("submitRequest", () => {
	let prevState: PlanFoodFormState;

	beforeEach(() => {
		prevState = {
			code: "CODE1",
			fields: {},
			message: "",
			success: true,
		};
		(createRequest as jest.Mock).mockResolvedValue([
			"e444d290-6723-44ed-a90f-5915ce7efcd5",
		]);
	});

	it("returns an error when the event code is missing", async () => {
		const formData = new FormData();
		prevState.code = "";

		const result = await submitRequest(prevState, formData);

		expect(result.success).toBe(false);
		expect(result.message).toBe(
			"Event code missing. Please refresh the page and try again."
		);
	});

	it("returns an error when schema validation fails", async () => {
		const formData = new FormData();
		formData.append("name-1", "Appetizer");
		formData.append("quantity-1", "NaN");

		const result = await submitRequest(prevState, formData);

		expect(result.success).toBe(false);
		expect(result.message).toBe(
			"There was a problem. Verify entries and try again."
		);
		expect(result.errors).toEqual({
			fieldErrors: { requests: ["Expected number, received nan"] },
			formErrors: [],
		});
		expect(result.fields).toEqual({
			"name-1": "Appetizer",
			"quantity-1": "NaN",
		});
	});

	it("returns an error if createRequest fails to return an ID", async () => {
		const formData = new FormData();
		formData.append("name-1", "Main Course");
		formData.append("quantity-1", "3");

		(createRequest as jest.Mock).mockResolvedValue([]);

		const result = await submitRequest(prevState, formData);

		expect(result.success).toBe(false);
		expect(result.message).toBe("Failed to create request. Please try again.");
		expect(result.fields).toEqual({
			"name-1": "Main Course",
			"quantity-1": "3",
		});
	});

	it("calls redirect on successful request creation", async () => {
		const formData = new FormData();
		formData.append("name-1", "Dessert");
		formData.append("quantity-1", "2");

		const result = await submitRequest(prevState, formData);

		expect(redirect).toHaveBeenCalledWith(`/event/${prevState.code}`);
		expect(result).toBeUndefined();
	});

	it("handles form data without name or quantity fields gracefully", async () => {
		const formData = new FormData();

		const result = await submitRequest(prevState, formData);

		expect(result.success).toBe(false);
		expect(result.message).toBe(
			"There was a problem. Verify entries and try again."
		);
		expect(result.errors).toBeDefined();
	});
});
