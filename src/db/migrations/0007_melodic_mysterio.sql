ALTER TABLE "public"."rsvp" ALTER COLUMN "response" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."response";--> statement-breakpoint
CREATE TYPE "public"."response" AS ENUM('yes', 'no');--> statement-breakpoint
ALTER TABLE "public"."rsvp" ALTER COLUMN "response" SET DATA TYPE "public"."response" USING "response"::"public"."response";