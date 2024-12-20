ALTER TABLE "event" ALTER COLUMN "description" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "hosts" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "location" SET DATA TYPE varchar(100);