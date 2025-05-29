import type { UserRole } from "@/lib/types";

// Define los nombres posibles de los permisos en el sistema
export type PermissionKey =
  | "manage_users" // Gestionar usuarios (crear, editar, eliminar)
  | "view_inventory" // Ver inventario
  | "edit_inventory" // Editar inventario (actualizar stock)
  | "manage_parts" // Gestionar piezas y componentes (crear, editar)
  | "view_parts" // Ver piezas y componentes
  | "view_movements" // Ver historial de movimientos (entradas/salidas)
  | "create_movements" // Registrar nuevos movimientos de inventario
  | "view_alerts" // Ver alertas (stock bajo)
  | "view_expiring_lots" // Ver lotes por vencer
  | "view_inventory_reports" // Ver reportes de inventario
  | "view_price_history" // Ver historial de precios de productos
  | "view_consumption_reports" // Ver reportes de consumos
  | "manage_suppliers" // Gestionar proveedores (crear, editar)
  | "manage_purchase_orders" // Gestionar órdenes de compra (crear, editar, eliminar)
  | "view_purchase_orders" // Ver órdenes de compra
  | "manage_kits" // Gestionar kits o conjuntos de piezas
  | "categorize_items" // Asignar etiquetas y categorías a productos
  | "generate_reports" // Generar y exportar informes
  | "access_integrations" // Acceder a integraciones con sistemas externos
  | "manage_part_batches"; // Gestionar lotes de piezas (crear, editar, eliminar)

// Define qué permisos tiene cada tipo de rol en el sistema
export const permissionsByRole: Record<UserRole, PermissionKey[]> = {
  admin: [
    "manage_users",
    "view_inventory",
    "edit_inventory",
    "manage_parts",
    "view_parts",
    "view_movements",
    "create_movements",
    "view_alerts",
    "view_expiring_lots",
    "view_inventory_reports",
    "view_price_history",
    "view_consumption_reports",
    "manage_suppliers",
    "manage_purchase_orders",
    "view_purchase_orders",
    "manage_kits",
    "categorize_items",
    "generate_reports",
    "access_integrations",
    "manage_part_batches",
  ],
  bodega: [
    "view_inventory",
    "edit_inventory",
    "view_parts",
    "view_movements",
    "create_movements",
    "view_alerts",
    "view_expiring_lots",
    "categorize_items",
    "generate_reports",
    "view_inventory_reports",
    "view_purchase_orders",
    "view_consumption_reports",
  ],
  compras: [
    "view_inventory",
    "manage_suppliers",
    "manage_purchase_orders",
    "view_purchase_orders",
    "view_price_history",
    "access_integrations",
  ],
};
