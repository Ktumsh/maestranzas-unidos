CREATE TYPE "public"."movement_type" AS ENUM('entrada', 'salida', 'transferencia', 'uso_en_proyecto');--> statement-breakpoint
DROP TABLE "product_categories" CASCADE;--> statement-breakpoint
DROP TABLE "product_suppliers" CASCADE;--> statement-breakpoint
DROP TABLE "products" CASCADE;--> statement-breakpoint
DROP TABLE "purchase_orders" CASCADE;--> statement-breakpoint
DROP TABLE "stock_movements" CASCADE;--> statement-breakpoint
DROP TABLE "suppliers" CASCADE;