CREATE TABLE IF NOT EXISTS "dishes" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"party_id" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parties" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"description" text,
	"end" timestamp with time zone NOT NULL,
	"hosts" varchar(256) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"short_id" varchar(5) NOT NULL,
	"start" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parties_short_id_unique" UNIQUE("short_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dishes" ADD CONSTRAINT "dishes_party_id_parties_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."parties"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "short_id_idx" ON "parties" USING btree ("short_id");