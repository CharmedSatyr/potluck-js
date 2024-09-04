"use server";

import validateCtx from "../validate-ctx";

interface Data {
	description: string;
	quantity: number;
	shortId: string;
}

const claimFoodPlan = async (data: Data): Promise<undefined> => {
	console.log(data);
	const { id, createdBy } = await validateCtx(data.shortId);
};

export default claimFoodPlan;
