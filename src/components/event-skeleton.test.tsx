import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import EventSkeleton from "@/components/event-skeleton";

jest.mock("next-auth/react", () => ({
	useSession: jest.fn(),
}));

jest.mock(
	"@/components/copy-link-button",
	() =>
		function mockButton() {
			return <button>Copy Link</button>;
		}
);

describe("EventSkeleton Component", () => {
	const eventProps = {
		createdBy: "b2c2e71d-c72a-4f8a-bce6-cc89c6a33529",
		description: "This is a test event description.",
		hosts: "Test Host",
		location: "Test Location",
		name: "Test Event",
		code: "CODE1",
		startDate: "2024-10-31",
		startTime: "18:00",
		createdAt: new Date("2024-10-01"),
		id: "c2c2e71d-c72a-4f8a-bce6-cc89c6a33520",
		updatedAt: new Date("2024-10-02"),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should render event details correctly", () => {
		(useSession as jest.Mock).mockReturnValueOnce({
			data: { user: { id: "user-999" } },
			status: "authenticated",
		});

		render(<EventSkeleton {...eventProps} />);

		expect(screen.getByText(`${eventProps.code}`)).toBeInTheDocument();
		expect(screen.getByText(eventProps.name)).toBeInTheDocument();
		expect(
			screen.getByText(`${eventProps.startDate} at ${eventProps.startTime}`)
		).toBeInTheDocument();
		expect(screen.getByText(eventProps.location)).toBeInTheDocument();
		expect(
			screen.getByText(`Hosted by ${eventProps.hosts}`)
		).toBeInTheDocument();
		expect(screen.getByText(eventProps.description)).toBeInTheDocument();
	});

	it("should render 'Edit' link if the user is the host", () => {
		(useSession as jest.Mock).mockReturnValueOnce({
			data: { user: { id: eventProps.createdBy } },
			status: "authenticated",
		});

		render(<EventSkeleton {...eventProps} />);

		const editLink = screen.getByRole("link", { name: /edit/i });

		expect(editLink).toBeInTheDocument();
		expect(editLink).toHaveAttribute("href", `/event/${eventProps.code}/edit`);
	});

	it("should not render 'Edit' link if the user is not the host", () => {
		(useSession as jest.Mock).mockReturnValueOnce({
			data: { user: { id: "user-999" } },
			status: "authenticated",
		});

		render(<EventSkeleton {...eventProps} />);

		expect(
			screen.queryByRole("link", { name: /edit/i })
		).not.toBeInTheDocument();
	});

	it("should render 'CopyLinkButton' if code is present", () => {
		(useSession as jest.Mock).mockReturnValueOnce({
			data: { user: { id: "user-999" } },
			status: "authenticated",
		});

		render(<EventSkeleton {...eventProps} />);

		const copyLinkButton = screen.getByRole("button", { name: /copy link/i });

		expect(copyLinkButton).toBeInTheDocument();
	});

	it("should not render 'CopyLinkButton' if no code is present", () => {
		(useSession as jest.Mock).mockReturnValueOnce({
			data: { user: { id: "user-999" } },
			status: "authenticated",
		});

		render(<EventSkeleton {...eventProps} code="" />);

		expect(
			screen.queryByRole("button", { name: /copy link/i })
		).not.toBeInTheDocument();
	});
});
