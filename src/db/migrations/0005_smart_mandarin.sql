ALTER TABLE "rsvp" DROP CONSTRAINT "custom_name";--> statement-breakpoint
ALTER TABLE "rsvp" ADD CONSTRAINT "unique_event_user" UNIQUE("event_id","user_id");