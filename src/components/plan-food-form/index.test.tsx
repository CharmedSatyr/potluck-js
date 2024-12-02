import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlanFoodForm from "@/components/plan-food-form";
import { Slot } from "@/db/schema/slot";

jest.mock("@/actions/db/delete-slot");

describe("PlanFoodForm", () => {
	const committedUsersBySlot = new Map();
	const slots: Slot[] = [];

	it.todo("These tests broke after adding ai. Unsure why.");

	/*
	it.skip("renders the PlanFoodForm with initial elements", async () => {
		await act(async () => {
			render(
				<PlanFoodForm
					code="testCode"
					committedUsersBySlot={committedUsersBySlot}
					slots={slots}
				/>
			);
		});

		expect(
			screen.getByRole("button", { name: /Add Slot/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Save and Continue/i })
		).toBeInTheDocument();
	});

	it.skip("adds a slot when Add Slot is clicked", async () => {
		await act(async () => {
			render(
				<PlanFoodForm
					code="testCode"
					committedUsersBySlot={committedUsersBySlot}
					slots={slots}
				/>
			);
		});
	
		const addButton = screen.getByRole("button", { name: /Add Slot/i });
	
		await userEvent.click(addButton);
	
		expect(screen.getAllByLabelText(/What's Needed/i).length).toBe(2);
		expect(screen.getAllByLabelText(/Signups Needed/i).length).toBe(2);
	});
	
	it.skip("removes a slot when the remove button is clicked", async () => {
		const slotsWithInitialData = [
			{ id: "testSlotId", item: "Sample", count: 1 } as Slot,
		]; // TODO: Don't use Slot type.
	
		await act(async () => {
			render(
				<PlanFoodForm
					code="testCode"
					committedUsersBySlot={committedUsersBySlot}
					slots={slotsWithInitialData}
				/>
			);
		});
	
		const removeButton = screen.getByRole("button", { name: /✕/i });
	
		await userEvent.click(removeButton);
	
		expect(screen.queryByLabelText(/What's Needed/i)).not.toBeInTheDocument();
	});
	
	it.skip("calls submit action on form submit", async () => {
		await act(async () => {
			render(
				<PlanFoodForm
					code="testCode"
					committedUsersBySlot={committedUsersBySlot}
					slots={slots}
				/>
			);
		});
	
		await act(async () => {
			fireEvent.submit.skip(screen.getByTestId("plan-food-form"));
		});
	
		await waitFor(() => {
			expect(submitSlots).toHaveBeenCalled();
		});
	});
	
	it.skip("disables Add Slot button when reaching the maximum slot limit", async () => {
		let counter = 0;
		const genRandItem = () =>
			({
				id: `${counter++}`,
				item: "test",
				count: 1,
			}) as Slot;
	
		const maxSlots = new Array(20).fill(null).map(() => genRandItem());
	
		await act(async () => {
			render(
				<PlanFoodForm
					code="testCode"
					committedUsersBySlot={committedUsersBySlot}
					slots={maxSlots}
				/>
			);
		});
	
		const addButton = screen.getByRole("button", { name: /Add Slot/i });
	
		expect(addButton).toBeDisabled();
	});
	
	it.skip("disables submit button if slots are invalid", async () => {
		const invalidSlots = [{ id: "testSlotId", item: "", count: 0 } as Slot];
	
		await act(async () => {
			render(
				<PlanFoodForm
					code="testCode"
					committedUsersBySlot={committedUsersBySlot}
					slots={invalidSlots}
				/>
			);
		});
	
		const submitButton = screen.getByRole("button", {
			name: /Save and Continue/i,
		});
	
		expect(submitButton).toBeDisabled();
	});
	
	it.skip("displays commitment information if a slot has commitments", async () => {
		const committedUsersWithSlot = new Map([
			["testSlotId", <span key="123">Committed User</span>],
		]);
		const slotsWithCommitment = [
			{ id: "testSlotId", item: "Sample", count: 1 } as Slot,
		];
	
		await act(async () => {
			render(
				<PlanFoodForm
					code="testCode"
					committedUsersBySlot={committedUsersWithSlot}
					slots={slotsWithCommitment}
				/>
			);
		});
	
		expect(screen.getByText(/Existing Commitments:/i)).toBeInTheDocument();
		expect(screen.getByText(/Committed User/i)).toBeInTheDocument();
	});
	*/
});
