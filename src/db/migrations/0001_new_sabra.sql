ALTER TABLE "request" RENAME TO "slot";--> statement-breakpoint
ALTER TABLE "commitment" RENAME COLUMN "request_id" TO "slot_id";--> statement-breakpoint
ALTER TABLE "commitment" DROP CONSTRAINT "commitment_request_id_request_id_fk";
--> statement-breakpoint
ALTER TABLE "slot" DROP CONSTRAINT "request_event_id_event_id_fk";
--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commitment" ADD CONSTRAINT "commitment_slot_id_slot_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."slot"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "slot" ADD CONSTRAINT "slot_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
