"use server";

import db from "@/db/connection";
import { Dish, dishes } from "@/db/schema/dishes";
import { eq } from "drizzle-orm";

const deleteDish = async (id: Dish["id"]): Promise<{ id: string }[]> =>
	await db.delete(dishes).where(eq(dishes.id, id)).returning({ id: dishes.id });

export default deleteDish;
