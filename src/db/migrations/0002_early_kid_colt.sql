ALTER TABLE "event" RENAME COLUMN "event_code" TO "code";--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "event_event_code_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "event_code_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "code_idx" ON "event" USING btree ("code");--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_code_unique" UNIQUE("code");