ALTER TABLE "parties" ALTER COLUMN "short_id" SET DATA TYPE varchar(6);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "short_id_idx" ON "parties" USING btree ("short_id");