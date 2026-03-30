import { Enum } from "@workspace/core";
import type { PgColumn } from "drizzle-orm/pg-core";
import {
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

function uniqueConstraintAsString<Table extends string, Column extends string>(
  table: Table,
  column: Column,
) {
  return `${table}_${column}_unique` as const;
}

const LIFE_CYCLE_DATES = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
};

const categories = pgTable("categories", {
  id: serial().primaryKey(),
  name: text().notNull(),
  parentId: integer("parent_id").references(
    (): PgColumn<
      {
        name: "id";
        tableName: "categories";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      object,
      object
    > => categories.id,
  ),
  ...LIFE_CYCLE_DATES,
});

const discountType = pgEnum("discount_type", ["fixed", "percent"]);

const COUPON_META = {
  tableName: "coupons",
  uniqueFields: Enum.defineStr(["code"]),
};

const COUPON_CONSTRAINTS = {
  couponCode: uniqueConstraintAsString(COUPON_META.tableName, COUPON_META.uniqueFields.code),
} as const;

const coupons = pgTable(COUPON_META.tableName, {
  id: serial().primaryKey(),
  name: text().notNull(),
  code: text().notNull().unique(COUPON_CONSTRAINTS.couponCode),
  discountType: discountType("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(),
  orderId: integer("order_id").references(() => orders.id),
  ...LIFE_CYCLE_DATES,
});

const orders = pgTable("orders", {
  id: serial().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id),
  ...LIFE_CYCLE_DATES,
});

const orderItems = pgTable("order_items", {
  id: serial().primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer().notNull(),
  price: doublePrecision().notNull(),
  ...LIFE_CYCLE_DATES,
});

const products = pgTable("products", {
  id: serial().primaryKey(),
  name: text().notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  image: text(),
  ...LIFE_CYCLE_DATES,
});

const stores = pgTable("stores", {
  id: serial().primaryKey(),
  name: text().notNull(),
  rating: doublePrecision().notNull(),
  image: text(),
  ...LIFE_CYCLE_DATES,
});

const storeProducts = pgTable(
  "store_products",
  {
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    price: doublePrecision().notNull(),
    stock: integer().notNull(),
    ...LIFE_CYCLE_DATES,
  },
  (table) => [primaryKey({ columns: [table.storeId, table.productId] })],
);

const USER_META = {
  tableName: "users",
  uniqueFields: Enum.defineStr(["email", "phone"]),
};

const USER_CONSTRAINTS = {
  userEmail: uniqueConstraintAsString(USER_META.tableName, USER_META.uniqueFields.email),
  userPhone: uniqueConstraintAsString(USER_META.tableName, USER_META.uniqueFields.phone),
} as const;

const users = pgTable(USER_META.tableName, {
  id: serial().primaryKey(),
  fullName: text("full_name").notNull(),
  [USER_META.uniqueFields.email]: text().notNull().unique(USER_CONSTRAINTS.userEmail),
  [USER_META.uniqueFields.phone]: text().notNull().unique(USER_CONSTRAINTS.userPhone),
  address: text().notNull(),
  passwordHash: text("password_hash").notNull(),
  ...LIFE_CYCLE_DATES,
});

export {
  categories,
  COUPON_CONSTRAINTS,
  COUPON_META,
  coupons,
  discountType,
  orderItems,
  orders,
  products,
  storeProducts,
  stores,
  USER_CONSTRAINTS,
  USER_META,
  users,
};
