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

//
// Enums
//
export const userRole = pgEnum("user_role", ["admin", "bodega", "compras"]);
export const actionTypes = pgEnum("action_type", [
  "email_verification",
  "password_recovery",
  "email_change",
]);
export const movementType = pgEnum("movement_type", [
  "entrada",
  "salida",
  "transferencia",
  "uso_en_proyecto",
]);

//
// Usuarios
//
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

//
// Envíos de correo electrónico
//
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

//
// Piezas
//
export const parts = table("parts", {
  id: uuid("id").defaultRandom().primaryKey(),
  serialNumber: varchar("serial_number", { length: 30 }).notNull().unique(),
  description: varchar("description", { length: 100 }).notNull(),
  location: varchar("location", { length: 50 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  minStock: integer("min_stock").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Part = InferSelectModel<typeof parts>;

//
// Movimientos de piezas
//
export const partMovements = table("part_movements", {
  id: uuid("id").defaultRandom().primaryKey(),
  partId: uuid("part_id")
    .notNull()
    .references(() => parts.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  type: movementType("type").notNull(),
  reason: text("reason"),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PartMovement = InferSelectModel<typeof partMovements>;

//
// Proveedores
//
export const suppliers = table("suppliers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
});

export type Supplier = InferSelectModel<typeof suppliers>;

//
// Log de actividad
//
export const activityLog = table("activity_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: uuid("entity_id"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export type ActivityLog = InferSelectModel<typeof activityLog>;

//
// Alertas de stock
//
export const stockAlerts = table("stock_alerts", {
  id: uuid("id").defaultRandom().primaryKey(),
  partId: uuid("part_id")
    .notNull()
    .references(() => parts.id, { onDelete: "cascade" }),
  stock: integer("stock").notNull(),
  minStock: integer("min_stock").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  notifiedAt: timestamp("notified_at"),
});

export type StockAlert = InferSelectModel<typeof stockAlerts>;

//
// Reportes de inventario
//
export const inventoryReports = table("inventory_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  reportType: varchar("report_type", { length: 50 }).notNull(),
});

export type InventoryReport = InferSelectModel<typeof inventoryReports>;
