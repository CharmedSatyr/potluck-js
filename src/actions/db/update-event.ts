"use server";

import { revalidatePath } from "next/cache";
import _ from "lodash";
import { JSONSchemaType } from "ajv";
import { eq } from "drizzle-orm";
import ajv from "@/actions/ajv";
import db from "@/db/connection";
import { Event, event, CustomizableEventValues } from "@/db/schema/event";
import validateCtx from "@/actions/validate-ctx";

export type UpdatedEvent = Pick<Event, "shortId"> &
	Partial<CustomizableEventValues>;

const schema: JSONSchemaType<UpdatedEvent> = {
	type: "object",
	properties: {
		description: { type: "string", nullable: true },
		hosts: { type: "string", nullable: true },
		location: { type: "string", nullable: true },
		name: { type: "string", nullable: true },
		shortId: { type: "string" },
		startDate: { type: "string", format: "date", nullable: true },
		startTime: { type: "string", format: "iso-time", nullable: true },
	},
	required: ["shortId"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

export const isUpdatedEvent = (data: unknown): data is UpdatedEvent =>
	validate(data);

const updateEvent = async (updatedEvent: UpdatedEvent): Promise<Event[]> => {
	if (Object.keys(updatedEvent).length <= 1) {
		return [];
	}

	if (!isUpdatedEvent(updatedEvent)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const { id } = await validateCtx(updatedEvent.shortId);

	const values = _.omit(updatedEvent, ["shortId"]); // Never update shortId

	return await db.update(event).set(values).where(eq(event.id, id)).returning();
};

export const updateEventAndRevalidate = async (
	updatedEvent: UpdatedEvent
): Promise<Event[]> => {
	revalidatePath(`/event/${updatedEvent.shortId}`, "page");

	return await updateEvent(updatedEvent);
};

export default updateEvent;
