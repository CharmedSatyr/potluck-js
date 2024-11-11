import { render, screen, fireEvent } from "@testing-library/react";
import ManageEventWizard from "@/components/manage-event-wizard";
import useAnchor from "@/hooks/use-anchor";

jest.mock("@/hooks/use-anchor");
jest.mock(
	"@/components/create-event-form",
	() =>
		function createEventForm() {
			return <div>Create Event Form</div>;
		}
);
jest.mock(
	"@/components/plan-food-form",
	() =>
		function planFoodForm() {
			return <div>Plan Food Form</div>;
		}
);

describe("ManageEventWizard", () => {
	beforeEach(() => {
		(useAnchor as jest.Mock).mockReturnValue(["create-event", jest.fn()]);
	});

	it("should render CreateEventForm and PlanFoodForm", () => {
		render(<ManageEventWizard />);

		expect(screen.getByText("Create Event Form")).toBeInTheDocument();
		expect(screen.getByText("Plan Food Form")).toBeInTheDocument();
	});

	it("should highlight the create event button initially", async () => {
		render(<ManageEventWizard />);

		expect(screen.getByText(/create an event/i)).toHaveClass("step-secondary");
		expect(screen.getByText(/plan the food/i)).not.toHaveClass(
			"step-secondary"
		);
	});

	it("should highlight the plan food button based on anchor state", async () => {
		(useAnchor as jest.Mock).mockReturnValue(["plan-food", jest.fn()]);

		render(<ManageEventWizard />);

		expect(screen.getByText(/create an event/i)).toHaveClass("step-secondary");
		expect(screen.getByText(/plan the food/i)).toHaveClass("step-secondary");
	});

	it("should scroll to the correct section when button is clicked", () => {
		const scrollToAnchor = jest.fn();
		(useAnchor as jest.Mock).mockReturnValueOnce([
			"create-event",
			scrollToAnchor,
		]);

		render(<ManageEventWizard />);

		fireEvent.click(screen.getByText(/Create an Event/i));

		expect(scrollToAnchor).toHaveBeenCalledWith("create-event");
	});
});
