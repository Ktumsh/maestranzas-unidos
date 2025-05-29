ALTER TABLE "part_movements" ADD COLUMN "supplier_id" uuid;--> statement-breakpoint
ALTER TABLE "suppliers" ADD COLUMN "payment_terms" varchar(100);--> statement-breakpoint
ALTER TABLE "part_movements" ADD CONSTRAINT "part_movements_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE set null ON UPDATE no action;