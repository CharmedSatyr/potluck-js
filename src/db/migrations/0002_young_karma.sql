ALTER TABLE "commitment" RENAME COLUMN "party_id" TO "food_plan_id";--> statement-breakpoint
ALTER TABLE "commitment" DROP CONSTRAINT "commitment_party_id_parties_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commitment" ADD CONSTRAINT "commitment_food_plan_id_food_plan_id_fk" FOREIGN KEY ("food_plan_id") REFERENCES "public"."food_plan"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
