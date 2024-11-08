import { render, screen, fireEvent } from "@testing-library/react";
import CourseInput from "@/components/plan-food-form/course-input";

describe("CourseInput", () => {
	let mockChange: jest.Mock;
	let mockRemove: jest.Mock;

	beforeEach(() => {
		mockChange = jest.fn();
		mockRemove = jest.fn();
	});

	it("renders input fields and labels", () => {
		render(
			<CourseInput
				change={mockChange}
				count="1"
				index={0}
				name="Sample Course"
				remove={mockRemove}
			/>
		);

		expect(screen.getByLabelText("What's Needed")).toBeInTheDocument();
		expect(screen.getByLabelText("Signups Needed")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /✕/i })).toBeInTheDocument();
	});

	it("calls remove with index when remove button is clicked", () => {
		render(
			<CourseInput
				index={1}
				change={mockChange}
				count="1"
				name="Sample Course"
				remove={mockRemove}
			/>
		);

		const removeButton = screen.getByRole("button", { name: /✕/i });

		fireEvent.click(removeButton);

		expect(mockRemove).toHaveBeenCalledWith(1);
	});

	it("calls change with correct values when text input changes", () => {
		render(
			<CourseInput
				index={0}
				change={mockChange}
				count="0"
				name="Sample Course"
				remove={mockRemove}
			/>
		);

		const nameInput = screen.getByLabelText("What's Needed");

		fireEvent.change(nameInput, { target: { value: "Updated Course" } });

		expect(mockChange).toHaveBeenCalledWith(0, "Updated Course", "0");
	});

	it("calls change with correct values when count input changes", () => {
		render(
			<CourseInput
				index={0}
				change={mockChange}
				count="1"
				name="Sample Course"
				remove={mockRemove}
			/>
		);

		const countInput = screen.getByRole("spinbutton");

		fireEvent.change(countInput, { target: { value: "5" } });

		expect(mockChange).toHaveBeenCalledWith(0, "Sample Course", "5");
	});

	it('increments the count when the "+" button is clicked', () => {
		render(
			<CourseInput
				index={0}
				change={mockChange}
				count="0"
				name="Sample Course"
				remove={mockRemove}
			/>
		);

		const incrementButton = screen.getAllByRole("button")[2];
		const countInput = screen.getByRole("spinbutton");

		fireEvent.click(incrementButton);

		expect(countInput).toHaveValue(1);
		expect(mockChange).toHaveBeenCalledWith(0, "Sample Course", "1");
	});

	it('decrements the count when the "-" button is clicked', () => {
		render(
			<CourseInput
				index={0}
				change={mockChange}
				count="1"
				name="Sample Course"
				remove={mockRemove}
			/>
		);

		const decrementButton = screen.getAllByRole("button")[1];
		const countInput = screen.getByRole("spinbutton");

		fireEvent.change(countInput, { target: { value: "2" } });

		fireEvent.click(decrementButton);

		expect(countInput).toHaveValue(1);
		expect(mockChange).toHaveBeenCalledWith(0, "Sample Course", "1");
	});

	it("does not decrement below 0 on the count input", () => {
		render(
			<CourseInput
				index={0}
				change={mockChange}
				count="1"
				name="Sample Course"
				remove={mockRemove}
			/>
		);

		const decrementButton = screen.getAllByRole("button")[1];
		const countInput = screen.getByRole("spinbutton");

		fireEvent.click(decrementButton);

		expect(countInput).toHaveValue(0);
		expect(mockChange).toHaveBeenLastCalledWith(0, "Sample Course", "0");
	});

	it("limits the count to a maximum of 99", () => {
		render(
			<CourseInput
				index={0}
				change={mockChange}
				count="1"
				name="Sample Course"
				remove={mockRemove}
			/>
		);

		const incrementButton = screen.getAllByRole("button")[2];
		const countInput = screen.getByRole("spinbutton");

		fireEvent.change(countInput, { target: { value: "99" } });

		fireEvent.click(incrementButton);

		expect(countInput).toHaveValue(99);
		expect(mockChange).toHaveBeenCalledWith(0, "Sample Course", "99");
	});
});
