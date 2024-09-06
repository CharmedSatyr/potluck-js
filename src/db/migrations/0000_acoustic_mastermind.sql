CREATE TABLE IF NOT EXISTS "commitment" (
	"avatar" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quantity" integer NOT NULL,
	"request_id" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"hosts" varchar(256) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"short_id" varchar(5) NOT NULL,
	"startDate" date NOT NULL,
	"startTime" time NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_short_id_unique" UNIQUE("short_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "request" (
	"course" varchar(256) NOT NULL,
	"count" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commitment" ADD CONSTRAINT "commitment_request_id_request_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."request"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "request" ADD CONSTRAINT "request_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "short_id_idx" ON "event" USING btree ("short_id");