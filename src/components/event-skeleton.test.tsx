import { render, screen } from "@testing-library/react";
import EventSkeleton from "@/components/event-skeleton";

jest.mock(
	"@/components/copy-link-button",
	() =>
		function CopyLinkButton({ text }: { text: string }) {
			return <button>{text}</button>;
		}
);

describe("EventSkeleton Component", () => {
	const eventProps = {
		authenticated: true,
		code: "CODE1",
		creator: {
			image: "https://www.discord.image",
			name: "Host Name",
		},
		description: "This is a test event description.",
		hosts: "Test Host",
		location: "Test Location",
		name: "Test Event",
		startDate: "2099-10-31",
		startTime: "18:00",
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should render full event details if the user is authenticated and the event is not passed", async () => {
		render(<EventSkeleton {...eventProps} />);

		expect(screen.getByText(eventProps.code)).toBeInTheDocument();
		expect(screen.getByText(eventProps.name)).toBeInTheDocument();
		expect(screen.getByText("October 30, 2099 at 1:00 PM")).toBeInTheDocument();
		expect(screen.getByText(eventProps.location)).toBeInTheDocument();
		expect(
			screen.getByText(`Hosted by ${eventProps.hosts}`)
		).toBeInTheDocument();
		expect(screen.getByText(eventProps.description)).toBeInTheDocument();
	});

	it("should render event details if the user is authenticated and the event is not passed", () => {
		render(<EventSkeleton {...eventProps} />);

		expect(screen.getByText(eventProps.code)).toBeInTheDocument();
		expect(screen.getByText(eventProps.name)).toBeInTheDocument();
		expect(screen.getByText("October 30, 2099 at 1:00 PM")).toBeInTheDocument();
		expect(screen.getByText(eventProps.location)).toBeInTheDocument();
		expect(
			screen.getByText(`Hosted by ${eventProps.hosts}`)
		).toBeInTheDocument();
		expect(screen.getByText(eventProps.description)).toBeInTheDocument();
	});

	it("shows sign-in prompt if user is not authenticated", () => {
		render(<EventSkeleton {...eventProps} authenticated={false} />);

		expect(
			screen.getByText("Sign In to see all the details!")
		).toBeInTheDocument();
		expect(screen.getByText(eventProps.code)).toBeInTheDocument();
		expect(screen.getByText(eventProps.name)).toBeInTheDocument();
		expect(
			screen.queryByText(`${eventProps.startDate} at ${eventProps.startTime}`)
		).not.toBeInTheDocument();
		expect(screen.queryByText(eventProps.location)).not.toBeInTheDocument();
		expect(
			screen.queryByText(`Hosted by ${eventProps.hosts}`)
		).not.toBeInTheDocument();
		expect(screen.queryByText(eventProps.description)).not.toBeInTheDocument();
	});

	it("should not render 'CopyLinkButton' if no code is present", () => {
		render(<EventSkeleton {...eventProps} />);

		expect(
			screen.queryByRole("button", { name: /copy link/i })
		).not.toBeInTheDocument();
	});
});
