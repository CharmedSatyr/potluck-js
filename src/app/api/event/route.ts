export const GET = async (_: Request) => {
	return new Response("Hello, Potluck!", {
		status: 200,
	});
};
