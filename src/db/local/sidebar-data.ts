import {
  IconAlertCircle,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSettings,
  IconTools,
  IconUsers,
} from "@tabler/icons-react";

export const sidebarData = {
  navMain: [
    { title: "Panel Principal", path: "/", icon: IconDashboard },
    { title: "Inventario", path: "/inventario", icon: IconDatabase },
    { title: "Usuarios y Roles", path: "/usuarios", icon: IconUsers },
    { title: "Proveedores", path: "/proveedores", icon: IconListDetails },
    { title: "Órdenes de Compra", path: "/ordenes", icon: IconFileDescription },
    { title: "Piezas y Componentes", path: "/piezas", icon: IconFileWord },
  ],
  navClouds: [
    {
      title: "Movimientos",
      icon: IconTools,
      items: [
        { title: "Entradas y Salidas", path: "/movimientos" },
        {
          title: "Transferencias Internas",
          path: "/movimientos/transferencias",
        },
        { title: "Uso en Proyectos", path: "/movimientos/proyectos" },
      ],
    },
    {
      title: "Alertas",
      icon: IconAlertCircle,
      path: "#",
      items: [
        { title: "Stock Bajo", path: "/alertas/stock-bajo" },
        { title: "Lotes por Vencer", path: "/alertas/vencimiento" },
      ],
    },
  ],
  reports: [
    {
      name: "Reportes de Inventario",
      path: "/reportes/inventario",
      icon: IconReport,
    },
    {
      name: "Historial de Precios",
      path: "/reportes/precios",
      icon: IconChartBar,
    },
    {
      name: "Consumos y Tendencias",
      path: "/reportes/consumo",
      icon: IconFileAi,
    },
  ],
  navSecondary: [
    { title: "Configuración", path: "/configuracion", icon: IconSettings },
    { title: "Centro de Ayuda", path: "/ayuda", icon: IconHelp },
  ],
};

export type SidebarDataType = typeof sidebarData;
export type MainItem = (typeof sidebarData.navMain)[number];
export type CloudItem = (typeof sidebarData.navClouds)[number];
export type ReportItem = (typeof sidebarData.reports)[number];
export type SecondaryItem = (typeof sidebarData.navSecondary)[number];
