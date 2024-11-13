CREATE TYPE "public"."response" AS ENUM('attending', 'not attending');--> statement-breakpoint
ALTER TABLE "rsvp" ADD COLUMN "response" "response";