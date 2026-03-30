ALTER TABLE "store_products"
ADD CONSTRAINT "store_products_store_id_stores_id_fk" FOREIGN key ("store_id") REFERENCES "public"."stores" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "store_products"
ADD CONSTRAINT "store_products_product_id_products_id_fk" FOREIGN key ("product_id") REFERENCES "public"."products" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
