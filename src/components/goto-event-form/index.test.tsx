import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { redirect } from "next/navigation";
import GotoEventForm from "@/components/goto-event-form";
import findEvent from "@/actions/db/find-event";

jest.mock("next/navigation", () => ({
	redirect: jest.fn(),
}));
jest.mock("@/actions/db/find-event");

describe("GotoEventForm", () => {
	beforeEach(() => {
		render(<GotoEventForm />);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders the form and submit button", async () => {
		const input = screen.getByRole("textbox");

		const button = screen.getByRole("button", { name: /Find an Event/i });

		await waitFor(() => {
			expect(input).toBeInTheDocument();

			expect(button).toBeInTheDocument();
		});
	});

	it("displays an error message when the event code does not exist", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([]);

		const input = screen.getByRole("textbox");

		const button = screen.getByRole("button", { name: /Find an Event/i });

		fireEvent.change(input, { target: { value: "WRONG" } });

		fireEvent.click(button);

		await waitFor(() => {
			expect(screen.getByRole("status").textContent).toMatch(
				/Event code not found/i
			);
		});
	});

	it("disables the button while pending", async () => {
		const input = screen.getByRole("textbox");

		const button = screen.getByRole("button", { name: /Find an Event/i });

		fireEvent.change(input, { target: { value: "TEST123" } });

		fireEvent.click(button);

		await waitFor(() => {
			expect(button).toHaveProperty("disabled", true);
		});
	});

	it("redirects when the event code exists", async () => {
		(findEvent as jest.Mock).mockResolvedValueOnce([
			{ code: "CODE1", message: "", success: true },
		]);

		const input = screen.getByRole("textbox");

		fireEvent.change(input, { target: { value: "CODE1" } });

		fireEvent.click(screen.getByRole("button", { name: /Find an Event/i }));

		await waitFor(() => {
			expect(redirect).toHaveBeenCalledWith("/event/CODE1");
		});
	});
});
