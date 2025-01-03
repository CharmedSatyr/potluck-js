ALTER TABLE "event" ALTER COLUMN "end_utc_ms" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "start_utc_ms" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN "startDate";--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN "startTime";