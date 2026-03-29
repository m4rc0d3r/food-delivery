CREATE TABLE "store_products" (
	"store_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"price" double precision NOT NULL,
	"stock" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "store_products_store_id_product_id_pk" PRIMARY KEY("store_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "price";