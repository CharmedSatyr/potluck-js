ALTER TABLE "slot" ADD COLUMN "order" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "slot" ADD CONSTRAINT "slot_order_unique" UNIQUE("order");