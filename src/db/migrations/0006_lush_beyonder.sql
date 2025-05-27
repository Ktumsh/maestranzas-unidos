ALTER TABLE "parts" ADD COLUMN "stock" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "parts" ADD COLUMN "min_stock" integer DEFAULT 0 NOT NULL;