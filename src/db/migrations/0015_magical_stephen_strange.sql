CREATE TABLE "batch_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"part_batch_id" uuid NOT NULL,
	"expiration_date" timestamp NOT NULL,
	"notified_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "batch_alerts" ADD CONSTRAINT "batch_alerts_part_batch_id_part_batches_id_fk" FOREIGN KEY ("part_batch_id") REFERENCES "public"."part_batches"("id") ON DELETE cascade ON UPDATE no action;