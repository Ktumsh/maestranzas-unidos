const CUSTOM_SEGMENTS: { [key: string]: string } = {
  usuarios: "Usuarios y Roles",
  ordenes: "Órdenes de Compra",
  piezas: "Piezas y Componentes",
  "reportes/inventario": "Reportes de inventario",
};

export const formatSegment = (segment: string, fullPath?: string) => {
  if (fullPath && CUSTOM_SEGMENTS[fullPath]) return CUSTOM_SEGMENTS[fullPath];
  if (CUSTOM_SEGMENTS[segment]) return CUSTOM_SEGMENTS[segment];

  const words = segment.replace(/-/g, " ").split(" ");
  const firstWord =
    words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  const rest = words.slice(1).join(" ").toLowerCase();
  return firstWord + (rest ? " " + rest : "");
};
