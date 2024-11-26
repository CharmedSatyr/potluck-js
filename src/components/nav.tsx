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

			<div className="flex-none navbar-end">
				<ul className="menu menu-horizontal items-center">
					<li className="hidden text-sm md:inline-block">
						Welcome, {session?.user?.name}
					</li>

					<li>
						<details className="dropdown dropdown-end">
							<summary role="button" tabIndex={0}>
								<div className="w-10 rounded-full border">
									<Image
										width={64}
										height={64}
										className="m-0 rounded-full p-0"
										src={String(session?.user?.image)}
										alt={`${session?.user?.name} Avatar`}
										priority
									/>
								</div>
							</summary>
							<ul
								tabIndex={0}
								className="dropdown-content rounded-t-none bg-base-300"
							>
								<li>
									<Link href="/start" className="text-nowrap no-underline">
										Create Event
									</Link>
								</li>
								<li>
									<Link href="/dashboard" className="text-nowrap no-underline">
										Dashboard
									</Link>
								</li>
								<li>
									<Form action={signOutAndRevalidate}>
										<button className="text-nowrap" type="submit">
											<a href="" className="no-underline">
												Sign Out
											</a>
										</button>
									</Form>
								</li>
							</ul>
						</details>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Nav;
