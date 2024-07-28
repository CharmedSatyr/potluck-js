import Link from "next/link";

const Home = () => {
	return (
		<main className="flex min-h-screen flex-col p-24">
			<h1 className="text-3xl uppercase">13 potato salads</h1>

			<Link href="/create-party" className="my-12">
				<button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
					Click here to start a party!
				</button>
			</Link>
		</main>
	);
};

export default Home;
