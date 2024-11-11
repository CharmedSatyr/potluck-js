import {
	act,
	render,
	screen,
	fireEvent,
	waitFor,
} from "@testing-library/react";
import { useSearchParams, usePathname } from "next/navigation";
import ManageEventForm from "@/components/manage-event-form";
import useAnchor from "@/hooks/use-anchor";

jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
	useSearchParams: jest.fn(),
}));
jest.mock("@/hooks/use-anchor");

describe("CreateEventForm", () => {
	const code = "CODE1";

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
		render(<ManageEventForm submitAction={submitAction} />);

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
		render(<ManageEventForm submitAction={submitAction} />);

		act(() => {
			fireEvent.submit(screen.getByRole("form"));
		});

		await waitFor(() => {
			expect(submitAction).toHaveBeenCalled();
		});
	});

	it("fills default values based on query params", () => {
		const searchParams = new URLSearchParams({
			source: "discord",
			name: "Sample Event",
			location: "Sample Location",
			startDate: "2025-01-01",
			startTime: "10:00",
		});
		(useSearchParams as jest.Mock).mockReturnValue(searchParams);

		render(<ManageEventForm submitAction={submitAction} />);

		expect(screen.getByPlaceholderText("Untitled Event")).toHaveValue(
			"Sample Event"
		);
		expect(
			screen.getByPlaceholderText("Place name, address, or link")
		).toHaveValue("Sample Location");
		expect(screen.getByDisplayValue("2025-01-01")).toBeInTheDocument();
		expect(screen.getByDisplayValue("10:00")).toBeInTheDocument();
	});

	it("calls scrollToAnchor with the correct query when state changes", async () => {
		(useSearchParams as jest.Mock).mockReturnValue(
			new URLSearchParams({ code })
		);

		submitAction.mockReturnValue({
			code,
			fields: {},
			success: true,
		});

		(useAnchor as jest.Mock).mockReturnValue(["", scrollToAnchor]);

		render(<ManageEventForm submitAction={submitAction} />);

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

		render(<ManageEventForm submitAction={submitAction} />);

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
