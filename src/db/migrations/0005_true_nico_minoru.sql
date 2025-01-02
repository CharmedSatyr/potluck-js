ALTER TABLE "event" ADD COLUMN "end_utc_ms" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "start_utc_ms" integer DEFAULT 0 NOT NULL;