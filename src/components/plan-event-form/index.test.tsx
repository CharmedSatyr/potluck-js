import {
	act,
	render,
	screen,
	fireEvent,
	waitFor,
} from "@testing-library/react";
import { useSearchParams, usePathname } from "next/navigation";
import PlanEventForm from "@/components/plan-event-form";
import useAnchor from "@/hooks/use-anchor";
import { CreateEventFormData } from "@/app/start/submit-actions.types";

jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
	useSearchParams: jest.fn(),
}));
jest.mock("@/hooks/use-anchor");

describe("PlanEventForm", () => {
	const code = "CODE1";

	const eventData: CreateEventFormData = {
		name: "Sample Event",
		location: "Sample Location",
		description: "Sample Description",
		hosts: "Sample Hosts",
		startDate: "2025-01-01",
		startTime: "10:00",
	};

	beforeEach(() => {
		(usePathname as jest.Mock).mockReturnValue("/events");
		(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));
		(useAnchor as jest.Mock).mockReturnValue(["", jest.fn()]);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const submitAction = jest.fn();
	const scrollToAnchor = jest.fn();

	it("renders form with default values", () => {
		render(
			<PlanEventForm
				code={code}
				eventData={eventData}
				submitAction={submitAction}
			/>
		);

		const inputs: HTMLInputElement[] = screen.getAllByRole("textbox");

		expect(inputs[0].name).toBe("name");
		expect(inputs[1].name).toBe("location");
		expect(inputs[2].name).toBe("hosts");
		expect(inputs[3].name).toBe("description");

		const dateInput: HTMLInputElement = screen.getByTestId("start-date");
		const timeInput: HTMLInputElement = screen.getByTestId("start-time");

		expect(dateInput.name).toBe("startDate");
		expect(timeInput.name).toBe("startTime");
	});

	it("called the submitAction on submit", async () => {
		render(
			<PlanEventForm
				code={code}
				eventData={eventData}
				submitAction={submitAction}
			/>
		);

		act(() => {
			fireEvent.submit(screen.getByRole("form"));
		});

		await waitFor(() => {
			expect(submitAction).toHaveBeenCalled();
		});
	});

	it("fills default values based on eventData", () => {
		render(
			<PlanEventForm
				code={code}
				eventData={eventData}
				submitAction={submitAction}
			/>
		);

		for (const field of Object.values(eventData)) {
			expect(screen.getByDisplayValue(field)).toBeInTheDocument();
		}
	});

	it("calls scrollToAnchor with the correct query when state.success is true", async () => {
		(useSearchParams as jest.Mock).mockReturnValue(
			new URLSearchParams({ code })
		);

		submitAction.mockReturnValue({
			code,
			fields: {},
			success: true,
		});

		(useAnchor as jest.Mock).mockReturnValue(["create-event", scrollToAnchor]);

		render(
			<PlanEventForm
				code={code}
				eventData={eventData}
				submitAction={submitAction}
			/>
		);

		act(() => {
			fireEvent.submit(screen.getByRole("form"));
		});

		await waitFor(() => {
			expect(scrollToAnchor).toHaveBeenCalledWith("plan-food", `?code=${code}`);
		});
	});

	it("shows error messages when fields are invalid", async () => {
		submitAction.mockReturnValue({
			code,
			errors: {
				fieldErrors: {
					name: ["Name is required."],
					startDate: ["Date is required."],
					startTime: ["Time is required."],
					hosts: ["Error 1."],
					location: ["Location is required."],
					description: ["Error 2."],
				},
			},
			fields: {},
			success: true,
		});

		render(
			<PlanEventForm
				code={code}
				eventData={eventData}
				submitAction={submitAction}
			/>
		);

		act(() => {
			fireEvent.submit(screen.getByRole("form"));
		});

		expect(screen.getByText(/name is required/i)).toBeInTheDocument();
		expect(screen.getByText(/date is required/i)).toBeInTheDocument();
		expect(screen.getByText(/time is required/i)).toBeInTheDocument();
		expect(screen.getByText(/error 1/i)).toBeInTheDocument();
		expect(screen.getByText(/location is required/i)).toBeInTheDocument();
		expect(screen.getByText(/error 2/i)).toBeInTheDocument();
	});
});
