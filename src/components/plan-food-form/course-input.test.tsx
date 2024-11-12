import { render, screen, fireEvent } from "@testing-library/react";
import CourseInput from "@/components/plan-food-form/course-input";

describe("CourseInput", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const handleChange = jest.fn();
	const handleRemove = jest.fn();

	const id = "a6842b4d-a9fa-4351-92e0-b6a6661ca40c";

	it("renders input fields and labels", () => {
		render(
			<CourseInput
				change={handleChange}
				count="1"
				id={id}
				index={0}
				name="Sample Course"
				remove={handleRemove}
			/>
		);

		expect(screen.getByLabelText("What's Needed")).toBeInTheDocument();
		expect(screen.getByLabelText("Signups Needed")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /✕/i })).toBeInTheDocument();
	});

	it("calls remove with index and id when remove button is clicked", () => {
		render(
			<CourseInput
				change={handleChange}
				count="0"
				id={id}
				index={1}
				name="Sample Course"
				remove={handleRemove}
			/>
		);

		const removeButton = screen.getByRole("button", { name: /✕/i });

		fireEvent.click(removeButton);

		expect(handleRemove).toHaveBeenCalledWith(1, id);
	});

	it("calls change with correct values when text input changes", () => {
		render(
			<CourseInput
				change={handleChange}
				count="0"
				id={id}
				index={0}
				name="Sample Course"
				remove={handleRemove}
			/>
		);

		const nameInput = screen.getByLabelText("What's Needed");

		fireEvent.change(nameInput, { target: { value: "Updated Course" } });

		expect(handleChange).toHaveBeenCalledWith(0, "Updated Course", "0");
	});

	it("calls change with correct values when count input changes", () => {
		render(
			<CourseInput
				change={handleChange}
				count="1"
				id={id}
				index={0}
				name="Sample Course"
				remove={handleRemove}
			/>
		);

		const countInput = screen.getByRole("spinbutton");

		fireEvent.change(countInput, { target: { value: "5" } });

		expect(handleChange).toHaveBeenCalledWith(0, "Sample Course", "5");
	});

	it('increments the count when the "+" button is clicked', () => {
		render(
			<CourseInput
				change={handleChange}
				count="0"
				id={id}
				index={0}
				name="Sample Course"
				remove={handleRemove}
			/>
		);

		const incrementButton = screen.getAllByRole("button")[2];
		const countInput = screen.getByRole("spinbutton");

		fireEvent.click(incrementButton);

		expect(countInput).toHaveValue(1);
		expect(handleChange).toHaveBeenCalledWith(0, "Sample Course", "1");
	});

	it('decrements the count when the "-" button is clicked', () => {
		render(
			<CourseInput
				change={handleChange}
				count="1"
				id={id}
				index={0}
				name="Sample Course"
				remove={handleRemove}
			/>
		);

		const decrementButton = screen.getAllByRole("button")[1];
		const countInput = screen.getByRole("spinbutton");

		fireEvent.change(countInput, { target: { value: "2" } });

		fireEvent.click(decrementButton);

		expect(countInput).toHaveValue(1);
		expect(handleChange).toHaveBeenCalledWith(0, "Sample Course", "1");
	});

	it("does not decrement below 0 on the count input", () => {
		render(
			<CourseInput
				change={handleChange}
				count="1"
				id={id}
				index={0}
				name="Sample Course"
				remove={handleRemove}
			/>
		);

		const decrementButton = screen.getAllByRole("button")[1];
		const countInput = screen.getByRole("spinbutton");

		fireEvent.click(decrementButton);

		expect(countInput).toHaveValue(0);
		expect(handleChange).toHaveBeenLastCalledWith(0, "Sample Course", "0");
	});

	it("limits the count to a maximum of 99", () => {
		render(
			<CourseInput
				change={handleChange}
				count="1"
				id={id}
				index={0}
				name="Sample Course"
				remove={handleRemove}
			/>
		);

		const incrementButton = screen.getAllByRole("button")[2];
		const countInput = screen.getByRole("spinbutton");

		fireEvent.change(countInput, { target: { value: "99" } });

		fireEvent.click(incrementButton);

		expect(countInput).toHaveValue(99);
		expect(handleChange).toHaveBeenCalledWith(0, "Sample Course", "99");
	});
});
