ALTER TABLE "orders"
DROP CONSTRAINT "orders_store_id_stores_id_fk";

--> statement-breakpoint
ALTER TABLE "orders"
DROP COLUMN "store_id";
