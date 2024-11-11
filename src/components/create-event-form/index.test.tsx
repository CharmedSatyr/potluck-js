import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useSearchParams, usePathname } from "next/navigation";
import CreateEventForm from "@/components/create-event-form";
import {
	createEventAction,
	loginAction,
} from "@/components/create-event-form/submit-actions";
import useAnchor from "@/hooks/use-anchor";
import { act } from "react";

jest.mock("next-auth/react", () => ({
	useSession: jest.fn(),
}));
jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
	useSearchParams: jest.fn(),
}));
jest.mock("@/hooks/use-anchor");
jest.mock("@/components/create-event-form/submit-actions", () => ({
	createEventAction: jest.fn(),
	loginAction: jest.fn(),
}));

describe("CreateEventForm", () => {
	const code = "CODE1";

	beforeEach(() => {
		(useSession as jest.Mock).mockReturnValue({ status: "authenticated" });
		(usePathname as jest.Mock).mockReturnValue("/events");
		(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));
		(useAnchor as jest.Mock).mockReturnValue([null, jest.fn()]);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders form with default values", () => {
		render(<CreateEventForm />);

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

	it("uses loginAction if unauthenticated", async () => {
		(useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });

		render(<CreateEventForm />);

		act(() => {
			fireEvent.submit(screen.getByRole("form"));
		});

		await waitFor(() => {
			expect(loginAction).toHaveBeenCalled();
			expect(createEventAction).not.toHaveBeenCalled();
		});
	});

	it("uses createEventAction if authenticated", async () => {
		render(<CreateEventForm />);

		act(() => {
			fireEvent.submit(screen.getByRole("form"));
		});

		await waitFor(() => {
			expect(createEventAction).toHaveBeenCalled();
			expect(loginAction).not.toHaveBeenCalled();
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

		render(<CreateEventForm />);

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

		(createEventAction as jest.Mock).mockReturnValue({
			code,
			fields: {},
			success: true,
		});

		const scrollToAnchor = jest.fn();
		(useAnchor as jest.Mock).mockReturnValue(["", scrollToAnchor]);

		render(<CreateEventForm />);

		act(() => {
			fireEvent.submit(screen.getByRole("form"));
		});

		await waitFor(() => {
			expect(scrollToAnchor).toHaveBeenCalledWith("plan-food", `?code=${code}`);
		});
	});

	it("shows error messages when fields are invalid", async () => {
		(createEventAction as jest.Mock).mockReturnValue({
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
		render(<CreateEventForm />);

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

/*

    it("uses createEventAction if authenticated", async () => {
        (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });

        render(<CreateEventForm />);

        const submitButton = (screen.getByRole("button", { name: "Next" }))

        await waitFor(() => {
            fireEvent.click(submitButton)
        })

        await waitFor(() => {
            expect(createEventAction).toHaveBeenCalled();
        })

    });

    xit("scrolls to anchor on 'plan-food' if state code and success conditions are met", () => {
        const scrollToAnchorMock = jest.fn();
        (useAnchor as jest.Mock).mockReturnValue(["plan-food", scrollToAnchorMock]);

        const searchParams = new URLSearchParams();
        searchParams.set("code", "CODE1");
        (useSearchParams as jest.Mock).mockReturnValue(searchParams);

        render(<CreateEventForm />);

        expect(scrollToAnchorMock).toHaveBeenCalledWith("plan-food", "?code=CODE1");
    });

    it("updates input fields correctly", async () => {
        render(<CreateEventForm />);
        const nameInput = screen.getByPlaceholderText("Untitled Event");

        fireEvent.change(nameInput, { target: { value: "My New Event" } });

        expect(nameInput).toHaveValue("My New Event");
    });

    xit("disables submit button when isPending is true", async () => {
        render(<CreateEventForm />);
        const submitButton: HTMLInputElement = screen.getByRole("button", { name: "Next" });

        expect(submitButton).toBeEnabled();

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        })
    });
    
});
*/
