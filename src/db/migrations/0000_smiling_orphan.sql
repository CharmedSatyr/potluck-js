CREATE TABLE IF NOT EXISTS "dish" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"party_id" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dish_party_id_unique" UNIQUE("party_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "party" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"description" text,
	"hosts" varchar(256) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"short_id" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "party_short_id_unique" UNIQUE("short_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dish" ADD CONSTRAINT "dish_party_id_party_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."party"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
