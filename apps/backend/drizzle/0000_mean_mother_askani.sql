CREATE TYPE "public"."discount_type" AS ENUM('fixed', 'percent');

--> statement-breakpoint
CREATE TABLE "categories" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "parent_id" INTEGER,
  "created_at" TIMESTAMP DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT now() NOT NULL
);

--> statement-breakpoint
CREATE TABLE "coupons" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "discount_type" "discount_type" NOT NULL,
  "discount_value" INTEGER NOT NULL,
  "order_id" INTEGER,
  "created_at" TIMESTAMP DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
  CONSTRAINT "coupons_code_unique" UNIQUE ("code")
);

--> statement-breakpoint
CREATE TABLE "order_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "order_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "created_at" TIMESTAMP DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT now() NOT NULL
);

--> statement-breakpoint
CREATE TABLE "orders" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" INTEGER NOT NULL,
  "store_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT now() NOT NULL
);

--> statement-breakpoint
CREATE TABLE "products" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "category_id" INTEGER NOT NULL,
  "image" TEXT,
  "created_at" TIMESTAMP DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT now() NOT NULL
);

--> statement-breakpoint
CREATE TABLE "stores" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "rating" DOUBLE PRECISION NOT NULL,
  "image" TEXT,
  "created_at" TIMESTAMP DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT now() NOT NULL
);

--> statement-breakpoint
CREATE TABLE "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "full_name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE ("email"),
  CONSTRAINT "users_phone_unique" UNIQUE ("phone")
);

--> statement-breakpoint
ALTER TABLE "categories"
ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN key ("parent_id") REFERENCES "public"."categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "coupons"
ADD CONSTRAINT "coupons_order_id_orders_id_fk" FOREIGN key ("order_id") REFERENCES "public"."orders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "order_items"
ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN key ("order_id") REFERENCES "public"."orders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "order_items"
ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN key ("product_id") REFERENCES "public"."products" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "orders"
ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN key ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "orders"
ADD CONSTRAINT "orders_store_id_stores_id_fk" FOREIGN key ("store_id") REFERENCES "public"."stores" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "products"
ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN key ("category_id") REFERENCES "public"."categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
