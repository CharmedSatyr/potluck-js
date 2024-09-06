"use server";

import { JSONSchemaType } from "ajv";
import { eq } from "drizzle-orm";
import ajv from "@/actions/ajv";
import db from "@/db/connection";
import { Event, event, CustomizableEventValues } from "@/db/schema/event";
import findEvent from "@/actions/db/find-event";
import { auth } from "@/auth";

export type UpdatedEvent = Pick<Event, "code"> &
	Partial<CustomizableEventValues>;

// TODO: Enforce that at least one updated property is included
const schema: JSONSchemaType<UpdatedEvent> = {
	type: "object",
	properties: {
		code: { type: "string" },
		description: { type: "string", nullable: true },
		hosts: { type: "string", nullable: true },
		location: { type: "string", nullable: true },
		name: { type: "string", nullable: true },
		startDate: { type: "string", format: "date", nullable: true },
		startTime: { type: "string", format: "iso-time", nullable: true },
	},
	required: ["code"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const updateEvent = async (updatedEvent: UpdatedEvent): Promise<any> => {
	if (!validate(updatedEvent)) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const { code, ...values } = updatedEvent;
	const eventToUpdate = await findEvent({ code });

	if (!eventToUpdate) {
		throw new Error("Invalid code");
	}

	const session = await auth();

	if (!session?.user?.email) {
		throw new Error("Not authenticated");
	}

	return await db
		.update(event)
		.set({ ...values })
		.where(eq(event.id, eventToUpdate.id))
		.returning({ code: event.code });
};

export default updateEvent;
