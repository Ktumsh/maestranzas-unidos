CREATE TABLE "inventory_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"file_path" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"report_type" varchar(50) NOT NULL
);
