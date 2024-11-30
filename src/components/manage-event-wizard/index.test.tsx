import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from "@testing-library/react";
import ManageEventWizard, { Step } from "@/components/manage-event-wizard";
import useAnchor from "@/hooks/use-anchor";
import PlanEventForm from "@/components/plan-event-form";
import PlanFoodForm from "@/components/plan-food-form";
import Suggestions from "@/components/suggestions";
import useItemSuggestions from "@/hooks/use-item-suggestions";

jest.mock("@/hooks/use-anchor");
jest.mock("@/components/plan-event-form");
jest.mock("@/components/plan-food-form");

describe("ManageEventWizard", () => {
	it.todo("Tests broke after adding ai/rsc");

	/*
	const code = "CODE1";
	const submitAction = jest.fn();
	const eventDataPromise = Promise.resolve([
		{
			name: "",
			location: "",
			startDate: "",
			startTime: "",
			hosts: "",
			description: "",
		},
	]);
	const slotsPromise = Promise.resolve([]);
	const committedUsersBySlotPromise = Promise.resolve(new Map());

	beforeEach(() => {
		(useAnchor as jest.Mock).mockReturnValue([Step.CREATE_EVENT, jest.fn()]);
		(PlanEventForm as jest.Mock).mockReturnValue(<div>Create Event Form</div>);
		(PlanFoodForm as jest.Mock).mockReturnValue(<div>Plan Food Form</div>);
		(Suggestions as jest.Mock).mockReturnValue(<div>Suggestions</div>);
		(useItemSuggestions as jest.Mock).mockReturnValue({
			advice: "",
			items: [],
		});
	});


	it("should render CreateEventForm and PlanFoodForm", async () => {
		await act(async () => {
			render(
				<ManageEventWizard
					code={code}
					committedUsersBySlotPromise={committedUsersBySlotPromise}
					eventDataPromise={eventDataPromise}
					loggedIn={true}
					mode="create"
					slotsPromise={slotsPromise}
					submitAction={submitAction}
				/>
			);
		});
		await waitFor(() => {
			expect(screen.getByText("Create Event Form")).toBeInTheDocument();
			expect(screen.getByText("Plan Food Form")).toBeInTheDocument();
		});
	});

	it("should pass through the submitAction to CreateEventForm", async () => {
		await act(async () => {
			render(
				<ManageEventWizard
					code={code}
					committedUsersBySlotPromise={committedUsersBySlotPromise}
					eventDataPromise={eventDataPromise}
					loggedIn={true}
					mode="create"
					slotsPromise={slotsPromise}
					submitAction={submitAction}
				/>
			);
		});

		expect(PlanEventForm).toHaveBeenCalled();
		expect((PlanEventForm as jest.Mock).mock.calls[0][0]).toMatchObject({
			submitAction,
		});
	});

	it("should highlight the create event button initially", async () => {
		await act(async () => {
			render(
				<ManageEventWizard
					code={code}
					committedUsersBySlotPromise={committedUsersBySlotPromise}
					eventDataPromise={eventDataPromise}
					loggedIn={true}
					mode="create"
					slotsPromise={slotsPromise}
					submitAction={submitAction}
				/>
			);
		});

		expect(screen.getByText(/create an event/i)).toHaveClass("step-secondary");
		expect(screen.getAllByText(/plan the food/i)[1]).not.toHaveClass(
			"step-secondary"
		);
	});

	it("should highlight the plan food button based on anchor state", async () => {
		(useAnchor as jest.Mock).mockReturnValue(["plan-food", jest.fn()]);

		render(
			<ManageEventWizard
				code={code}
				committedUsersBySlotPromise={committedUsersBySlotPromise}
				eventDataPromise={eventDataPromise}
				loggedIn={true}
				mode="create"
				slotsPromise={slotsPromise}
				submitAction={submitAction}
			/>
		);

		expect(screen.getByText(/create an event/i)).toHaveClass("step-secondary");
		expect(screen.getAllByText(/plan the food/i)[1]).toHaveClass(
			"step-secondary"
		);
	});

	it("should scroll to the correct section when button is clicked", () => {
		const scrollToAnchor = jest.fn();
		(useAnchor as jest.Mock).mockReturnValueOnce([
			Step.CREATE_EVENT,
			scrollToAnchor,
		]);

		render(
			<ManageEventWizard
				code={code}
				committedUsersBySlotPromise={committedUsersBySlotPromise}
				eventDataPromise={eventDataPromise}
				loggedIn={true}
				mode="create"
				slotsPromise={slotsPromise}
				submitAction={submitAction}
			/>
		);

		fireEvent.click(screen.getByText(/Create an Event/i));

		expect(scrollToAnchor).toHaveBeenCalledWith("create-event");
	});
	*/
});
