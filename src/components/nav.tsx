import Link from "next/link";
import SignOut from "./sign-out";
import siteMetadata from "@/data/site-metadata";
import { auth } from "@/auth";
import Image from "next/image";
import Form from "next/form";
import signOutAndRevalidate from "@/actions/auth/sign-out-and-revalidate";

const Nav = async () => {
	const session = await auth();

	return (
		<div className="navbar bg-base-100">
			<div className="navbar-start">
				<Link href="/" className="btn btn-ghost btn-sm text-xl">
					{siteMetadata.title}
				</Link>
			</div>

			<div className="navbar-end gap-2">
				<div className="text-sm hidden md:inline-block">Welcome, {session?.user?.name}</div>
				<div className="dropdown dropdown-end">
					<div
						tabIndex={0}
						role="button"
						className="avatar btn btn-circle btn-ghost"
					>
						<div className="w-10 rounded-full border">
							<Image
								width={64}
								height={64}
								className="my-0"
								src={String(session?.user?.image)}
								alt={`${session?.user?.name} Avatar`}
								priority
							/>
						</div>
					</div>
					<ul
						tabIndex={0}
						className="menu dropdown-content menu-sm z-[1] mt-2 w-fit rounded-box bg-base-300 p-2 shadow"
					>
						<li>
							<Link href="/start" className="no-underline text-nowrap">
								Create Event
							</Link>
						</li>
						<li>
							<Link href="/dashboard" className="no-underline text-nowrap">
								Dashboard
							</Link>
						</li>
						<li>
							<Form action={signOutAndRevalidate} className="w-full">
								<button className="text-nowrap" type="submit"><a href="" className="no-underline">Sign Out</a></button>
							</Form>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Nav;
