import { auth } from "@/auth";

export const middleware = auth((req) => {
	if (!req.auth) {
		// DO SOMETHING
	} else {
		// DO SOMETHING
	}
});

export default middleware;
