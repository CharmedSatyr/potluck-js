import Link from "next/link";
import siteMetadata from "@/data/site-metadata";
import { auth } from "@/auth";
import Image from "next/image";
import Form from "next/form";
import signOutAndRevalidate from "@/actions/auth/sign-out-and-revalidate";
import { PropsWithChildren } from "react";
import {
	ArrowRightStartOnRectangleIcon,
	CalendarDateRangeIcon,
	TableCellsIcon,
} from "@heroicons/react/24/outline";
import signInWithDiscordAndRevalidate from "@/actions/auth/sign-in-with-discord-and-revalidate";
import { DiscordIcon } from "@/components/icons/discord";

const LoggedOutContent = () => {
	return (
		<div className="navbar-end">
			<Form action={signInWithDiscordAndRevalidate}>
				<button className="btn btn-accent btn-sm" type="submit">
					Sign In <DiscordIcon height="16" width="16" />
				</button>
			</Form>
		</div>
	);
};

const CreateEventLink = () => (
	<Link href="/start" className="text-nowrap no-underline">
		<CalendarDateRangeIcon className="size-4" />
		Create Event
	</Link>
);

const DashboardLink = () => (
	<Link href="/dashboard" className="text-nowrap no-underline">
		<TableCellsIcon className="size-4" />
		Dashboard
	</Link>
);

const Signout = () => (
	<Form action={signOutAndRevalidate} className="w-full">
		<button className="m-0 w-full min-w-28 p-0" type="submit">
			<a className="w-full no-underline">
				<ArrowRightStartOnRectangleIcon className="-ml-8 mr-1 inline-block size-5" />{" "}
				Sign Out
			</a>
		</button>
	</Form>
);

const LoggedInContent = ({ image, name }: { image: string; name: string }) => {
	return (
		<div className="navbar-end w-3/4">
			<ul className="menu menu-horizontal items-center">
				<li className="hidden lg:inline-block">
					<CreateEventLink />
				</li>
				<li className="hidden lg:inline-block">
					<DashboardLink />
				</li>
				<li className="hidden text-sm sm:inline-flex">Welcome, {name}</li>

				<li>
					<details className="dropdown dropdown-end">
						<summary role="button" tabIndex={0}>
							<div className="w-10 rounded-full border">
								<Image
									width={64}
									height={64}
									className="m-0 rounded-full p-0"
									src={image}
									alt={`${name}'s Avatar`}
									priority
								/>
							</div>
						</summary>
						<ul
							tabIndex={0}
							className="dropdown-content w-fit rounded-t-none bg-base-300"
						>
							<li className="lg:hidden">
								<CreateEventLink />
							</li>
							<li className="lg:hidden">
								<DashboardLink />
							</li>
							<li>
								<Signout />
							</li>
						</ul>
					</details>
				</li>
			</ul>
		</div>
	);
};

const Nav = ({ children }: PropsWithChildren) => {
	return (
		<div className="navbar max-h-16 bg-base-100/50">
			<div className="navbar-start">
				<Link href="/" className="btn btn-ghost btn-sm text-xl">
					{siteMetadata.title}
				</Link>
			</div>

			{children}
		</div>
	);
};

const NavBar = async () => {
	const session = await auth();

	if (!session?.user?.image || !session.user.name) {
		return (
			<Nav>
				<LoggedOutContent />
			</Nav>
		);
	}

	return (
		<Nav>
			<LoggedInContent image={session.user.image} name={session.user.name} />
		</Nav>
	);
};

export default NavBar;
