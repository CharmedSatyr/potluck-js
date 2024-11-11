import { render, screen, fireEvent } from "@testing-library/react";
import ManageEventWizard from "@/components/manage-event-wizard";
import useAnchor from "@/hooks/use-anchor";
import ManageEventForm from "@/components/manage-event-form";
import PlanFoodForm from "@/components/plan-food-form";

jest.mock("@/hooks/use-anchor");
jest.mock("@/components/manage-event-form");
jest.mock("@/components/plan-food-form");

describe("ManageEventWizard", () => {
	beforeEach(() => {
		(useAnchor as jest.Mock).mockReturnValue(["create-event", jest.fn()]);
		(ManageEventForm as jest.Mock).mockReturnValue(
			<div>Create Event Form</div>
		);
		(PlanFoodForm as jest.Mock).mockReturnValue(<div>Plan Food Form</div>);
	});

	const submitAction = jest.fn();

	it("should render CreateEventForm and PlanFoodForm", () => {
		render(<ManageEventWizard submitAction={submitAction} />);

		expect(screen.getByText("Create Event Form")).toBeInTheDocument();
		expect(screen.getByText("Plan Food Form")).toBeInTheDocument();
	});

	it("should pass through the submitAction to CreateEventForm", () => {
		render(<ManageEventWizard submitAction={submitAction} />);

		expect(ManageEventForm).toHaveBeenCalled();
		expect((ManageEventForm as jest.Mock).mock.calls[0][0]).toMatchObject({
			submitAction,
		});
	});

	it("should highlight the create event button initially", async () => {
		render(<ManageEventWizard submitAction={submitAction} />);

		expect(screen.getByText(/create an event/i)).toHaveClass("step-secondary");
		expect(screen.getByText(/plan the food/i)).not.toHaveClass(
			"step-secondary"
		);
	});

	it("should highlight the plan food button based on anchor state", async () => {
		(useAnchor as jest.Mock).mockReturnValue(["plan-food", jest.fn()]);

		render(<ManageEventWizard submitAction={submitAction} />);

		expect(screen.getByText(/create an event/i)).toHaveClass("step-secondary");
		expect(screen.getByText(/plan the food/i)).toHaveClass("step-secondary");
	});

	it("should scroll to the correct section when button is clicked", () => {
		const scrollToAnchor = jest.fn();
		(useAnchor as jest.Mock).mockReturnValueOnce([
			"create-event",
			scrollToAnchor,
		]);

		render(<ManageEventWizard submitAction={submitAction} />);

		fireEvent.click(screen.getByText(/Create an Event/i));

		expect(scrollToAnchor).toHaveBeenCalledWith("create-event");
	});
});
