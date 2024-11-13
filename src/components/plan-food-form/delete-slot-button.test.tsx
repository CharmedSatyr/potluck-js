import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteSlotButton from "@/components/plan-food-form/delete-slot-button";

describe("DeleteSlotButton", () => {
	beforeAll(() => {
		HTMLDialogElement.prototype.showModal = jest.fn();
		HTMLDialogElement.prototype.close = jest.fn();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const remove = jest.fn();

	it("renders delete button without dialog when there are no commitments", () => {
		render(
			<DeleteSlotButton
				hasCommitments={false}
				id={"123"}
				index={0}
				remove={remove}
			/>
		);

		const deleteButton = screen.getByRole("button", { name: "✕" });
		expect(deleteButton).toBeInTheDocument();
		expect(
			screen.queryByText("Delete Slot Confirmation")
		).not.toBeInTheDocument();
	});

	it("calls remove function when delete button is clicked and there are no commitments", () => {
		render(
			<DeleteSlotButton
				hasCommitments={false}
				id={"123"}
				index={0}
				remove={remove}
			/>
		);

		const deleteButton = screen.getByRole("button", { name: "✕" });

		fireEvent.click(deleteButton);

		expect(remove).toHaveBeenCalledWith(0, "123");
		expect(remove).toHaveBeenCalledTimes(1);
	});

	it("renders confirmation dialog when there are commitments", () => {
		render(
			<DeleteSlotButton
				hasCommitments={true}
				id={"123"}
				index={1}
				remove={remove}
			/>
		);

		const deleteButton = screen.getByRole("button", { name: "✕" });

		fireEvent.click(deleteButton);

		expect(screen.getByText("Delete Slot Confirmation")).toBeInTheDocument();
		expect(
			screen.getByText(/Some attendees have already signed up/i)
		).toBeInTheDocument();
	});

	it.skip("closes the dialog when the cancel button is clicked", () => {
		render(
			<DeleteSlotButton
				hasCommitments={true}
				id={"123"}
				index={1}
				remove={remove}
			/>
		);

		fireEvent.click(screen.getByRole("button", { name: "✕" }));

		expect(screen.getByText("Delete Slot Confirmation")).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

		expect(
			screen.queryByText("Delete Slot Confirmation")
		).not.toBeInTheDocument();
	});

	it.skip("calls remove and closes dialog when 'Delete Slot' button is clicked in dialog", async () => {
		render(
			<DeleteSlotButton
				hasCommitments={true}
				id={"123"}
				index={1}
				remove={remove}
			/>
		);

		fireEvent.click(screen.getByRole("button", { name: "✕" }));

		expect(screen.getByText("Delete Slot Confirmation")).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Delete Slot" }));

		expect(remove).toHaveBeenCalledWith(1, "123");
		expect(remove).toHaveBeenCalledTimes(1);
		expect(
			screen.queryByText("Delete Slot Confirmation")
		).not.toBeInTheDocument();
	});
});
