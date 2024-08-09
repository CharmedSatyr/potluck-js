import Link from "next/link";

const Home = () => {
	return (
		<main>
			<h1>13 potato salads</h1>

			<Link href="/create-party" className="my-12">
				<button className="btn">
					Click here to start a party!
				</button>
			</Link>
		</main>
	);
};

export default Home;
