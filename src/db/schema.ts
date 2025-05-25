import { InferSelectModel } from "drizzle-orm";
import {
  pgTable as table,
  varchar,
  timestamp,
  uuid,
  text,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

// Usuarios admin / bodega / compras
export const userRole = pgEnum("user_role", ["admin", "bodega", "compras"]);

export const users = table("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: userRole("role").notNull(),
  status: varchar("status", { length: 50 }).default("enabled").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = InferSelectModel<typeof users>;

export const actionTypes = pgEnum("action_type", [
  "email_verification",
  "password_recovery",
  "email_change",
]);

// Envíos de correo electrónico
export const emailSends = table("email_sends", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  code: varchar("code", { length: 6 }),
  token: varchar("token", { length: 64 }).notNull(),
  actionType: actionTypes("action_type"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  verifiedAt: timestamp("verified_at"),
});

export type EmailSends = InferSelectModel<typeof emailSends>;

// Productos
export const products = table("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => productCategories.id),
  stock: integer("stock").default(0),
  minStock: integer("min_stock").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Product = InferSelectModel<typeof products>;

// Categorías de productos
export const productCategories = table("product_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

export type ProductCategory = InferSelectModel<typeof productCategories>;

// Movimientos de stock
export const stockMovements = table("stock_movements", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  reason: text("reason"),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type StockMovement = InferSelectModel<typeof stockMovements>;

// Órdenes de compra
export const purchaseOrders = table("purchase_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  status: varchar("status", { length: 50 }).default("pendiente"),
  requestedBy: uuid("requested_by").references(() => users.id),
  approvedBy: uuid("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PurchaseOrder = InferSelectModel<typeof purchaseOrders>;

// Proveedores
export const suppliers = table("suppliers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
});

export type Supplier = InferSelectModel<typeof suppliers>;

// Productos y proveedores (relación muchos a muchos)
export const productSuppliers = table("product_suppliers", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id),
  supplierId: uuid("supplier_id").references(() => suppliers.id),
});

export type ProductSupplier = InferSelectModel<typeof productSuppliers>;

// Órdenes de venta
export const activityLog = table("activity_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: uuid("entity_id"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export type ActivityLog = InferSelectModel<typeof activityLog>;
