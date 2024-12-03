ALTER TABLE "slot" DROP CONSTRAINT "slot_order_unique";--> statement-breakpoint
ALTER TABLE "slot" ALTER COLUMN "order" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "slot" ALTER COLUMN "order" SET DEFAULT 1000;