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
  | "create_purchase_orders" // Crear órdenes de compra
  | "approve_purchase_orders" // Aprobar órdenes de compra
  | "view_purchase_orders" // Ver órdenes de compra
  | "manage_kits" // Gestionar kits o conjuntos de piezas
  | "view_price_history" // Ver historial de precios de productos
  | "categorize_items" // Asignar etiquetas y categorías a productos
  | "generate_reports" // Generar y exportar informes
  | "access_integrations"; // Acceder a integraciones con sistemas externos

// Define qué permisos tiene cada tipo de rol en el sistema
export const permissionsByRole: Record<UserRole, PermissionKey[]> = {
  admin: [
    // El administrador tiene acceso total a todas las funcionalidades
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
    "create_purchase_orders",
    "approve_purchase_orders",
    "view_purchase_orders",
    "manage_kits",
    "view_price_history",
    "categorize_items",
    "generate_reports",
    "access_integrations",
  ],
  bodega: [
    // El rol "bodega" puede trabajar directamente con el inventario
    "view_inventory",
    "edit_inventory",
    "view_parts",
    "view_movements",
    "create_movements",
    "view_alerts",
    "view_expiring_lots",
    "categorize_items",
    "view_inventory_reports",
    "view_consumption_reports",
  ],
  compras: [
    // El rol "compras" se enfoca en proveedores y órdenes de compra
    "view_inventory",
    "view_parts",
    "manage_suppliers",
    "create_purchase_orders",
    "approve_purchase_orders",
    "view_purchase_orders",
    "view_price_history",
    "access_integrations",
  ],
};
