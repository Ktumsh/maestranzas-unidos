import { db } from "./db";
import { locations } from "./schema";

export const initialLocations = [
  {
    warehouse: "Bodega Norte",
    shelf: "1A - Nivel 1",
    description: "Tornillos, pernos y fijaciones pequeñas",
  },
  {
    warehouse: "Bodega Norte",
    shelf: "1A - Nivel 2",
    description: "Tuercas y arandelas clasificadas",
  },
  {
    warehouse: "Bodega Norte",
    shelf: "1A - Nivel 3",
    description: "Pernos especiales de acero templado",
  },
  {
    warehouse: "Bodega Norte",
    shelf: "1B - Nivel 1",
    description: "Sensores de presión y temperatura",
  },
  {
    warehouse: "Bodega Norte",
    shelf: "1B - Nivel 2",
    description: "Pequeños componentes electrónicos",
  },
  {
    warehouse: "Bodega Norte",
    shelf: "1B - Nivel 3",
    description: "Microcontroladores para automatización",
  },
  {
    warehouse: "Bodega Norte",
    shelf: "2A - Nivel 1",
    description: "Tuberías de PVC de bajo calibre",
  },
  {
    warehouse: "Bodega Norte",
    shelf: "2A - Nivel 2",
    description: "Codos y uniones plásticas",
  },
  {
    warehouse: "Bodega Norte",
    shelf: "2A - Nivel 3",
    description: "Abrazaderas metálicas para tubos",
  },

  {
    warehouse: "Bodega Sur",
    shelf: "2B - Nivel 1",
    description: "Herramientas manuales (llaves, destornilladores)",
  },
  {
    warehouse: "Bodega Sur",
    shelf: "2B - Nivel 2",
    description: "Juego de dados y carracas",
  },
  {
    warehouse: "Bodega Sur",
    shelf: "2B - Nivel 3",
    description: "Repuestos para herramientas eléctricas",
  },
  {
    warehouse: "Bodega Sur",
    shelf: "3A - Nivel 1",
    description: "Material eléctrico: cables y conectores",
  },
  {
    warehouse: "Bodega Sur",
    shelf: "3A - Nivel 2",
    description: "Interruptores y disyuntores",
  },
  {
    warehouse: "Bodega Sur",
    shelf: "3A - Nivel 3",
    description: "Iluminación industrial y accesorios",
  },

  {
    warehouse: "Bodega Central",
    shelf: "1A - Nivel 1",
    description: "Rodamientos y cojinetes grandes",
  },
  {
    warehouse: "Bodega Central",
    shelf: "1A - Nivel 2",
    description: "Motores hidráulicos",
  },
  {
    warehouse: "Bodega Central",
    shelf: "1A - Nivel 3",
    description: "Bombas de agua industriales",
  },
  {
    warehouse: "Bodega Central",
    shelf: "1B - Nivel 1",
    description: "Pistones y cilindros neumáticos",
  },
  {
    warehouse: "Bodega Central",
    shelf: "1B - Nivel 2",
    description: "Actuadores lineales",
  },
  {
    warehouse: "Bodega Central",
    shelf: "1B - Nivel 3",
    description: "Componentes de automatización",
  },

  {
    warehouse: "Bodega Este",
    shelf: "2A - Nivel 1",
    description: "Elementos de seguridad (EPP)",
  },
  {
    warehouse: "Bodega Este",
    shelf: "2A - Nivel 2",
    description: "Guantes, cascos y gafas de seguridad",
  },
  {
    warehouse: "Bodega Este",
    shelf: "2A - Nivel 3",
    description: "Chalecos reflectantes y señalética",
  },
  {
    warehouse: "Bodega Este",
    shelf: "2B - Nivel 1",
    description: "Consumibles: cintas, lubricantes, aceites",
  },
  {
    warehouse: "Bodega Este",
    shelf: "2B - Nivel 2",
    description: "Sprays técnicos y químicos controlados",
  },
  {
    warehouse: "Bodega Este",
    shelf: "2B - Nivel 3",
    description: "Limpiadores industriales",
  },
];

async function seed() {
  try {
    await db.insert(locations).values(initialLocations);
    console.log("✅ Ubicaciones insertadas correctamente");
  } catch (err) {
    console.error("❌ Error al insertar ubicaciones:", err);
  }
}

seed();
