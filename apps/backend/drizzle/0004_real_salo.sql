ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_product_id_pk" PRIMARY KEY("order_id","product_id");--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "id";