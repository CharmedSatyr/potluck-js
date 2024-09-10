"use server";

import { JSONSchemaType } from "ajv";
import { eq } from "drizzle-orm";
import ajv from "@/actions/ajv";
import findEvent from "@/actions/db/find-event";
import db from "@/db/connection";
import { commitment, Commitment } from "@/db/schema/commitment";
import { Event } from "@/db/schema/event";
import { request } from "@/db/schema/request";

interface EventCode {
	eventCode: Event["code"];
}

const schema: JSONSchemaType<EventCode> = {
	type: "object",
	properties: {
		eventCode: { type: "string" },
	},
	required: ["eventCode"],
	additionalProperties: false,
};

const validate = ajv.compile(schema);

const findCommitments = async ({
	eventCode,
}: EventCode): Promise<Commitment[]> => {
	if (!validate({ eventCode })) {
		throw new Error(JSON.stringify(validate.errors));
	}

	const [event] = await findEvent({ code: eventCode });

	if (!event) {
		throw new Error("Invalid event code");
	}

	const {
		createdAt,
		createdBy,
		description,
		id,
		quantity,
		requestId,
		updatedAt,
	} = commitment;

	return await db
		.select({
			createdAt,
			createdBy,
			description,
			id,
			quantity,
			requestId,
			updatedAt,
		})
		.from(request)
		.where(eq(request.eventId, event.id))
		.innerJoin(commitment, eq(request.id, commitment.requestId));
};

export default findCommitments;
