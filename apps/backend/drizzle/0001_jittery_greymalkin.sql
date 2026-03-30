CREATE TABLE "store_products" (
  "store_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "stock" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
  CONSTRAINT "store_products_store_id_product_id_pk" PRIMARY KEY ("store_id", "product_id")
);

--> statement-breakpoint
ALTER TABLE "products"
DROP COLUMN "price";
