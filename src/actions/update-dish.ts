"use server";

import db from "@/db/connection";
import { Dish, dishes } from "@/db/schema/dishes";
import { desc, eq } from "drizzle-orm";

export type UpdatedDish = Pick<Dish, "id"> &
	Partial<Pick<Dish, "description" | "name">>;

const updateDish = async ({
	description,
	id,
	name,
}: UpdatedDish): Promise<Dish[]> => {
	console.log("hi", id);
	if (!id) {
		return [];
	}
	if (!description && !name) {
		return [];
	}

	const values: UpdatedDish = { id };

	if (description) {
		values.description = description;
	}

	if (name) {
		values.name = name;
	}

	console.log("Hi, updating this thing", values);

	return await db
		.update(dishes)
		.set(values)
		.where(eq(dishes.id, id))
		.returning();
};

export default updateDish;
