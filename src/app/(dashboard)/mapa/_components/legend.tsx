import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { warehouseColors } from "../../_lib/utils";

const Legend = () => {
  return (
    <div className="lg:col-span-1">
      <Card className="bg-base-300">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Leyenda del Mapa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {Object.entries(warehouseColors.background).map(
              ([warehouse, color]) => (
                <div key={warehouse} className="flex items-center gap-3">
                  <div className={cn("size-3 rounded sm:size-4", color)} />
                  <span className="text-xs font-medium sm:text-sm">
                    {warehouse}
                  </span>
                </div>
              ),
            )}
          </div>
          <div className="space-y-3 border-t pt-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="bg-neutral h-2 w-3 rounded-sm border sm:h-3 sm:w-4"></div>
              <span>Estantería Industrial</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-neutral/70 h-2 w-3 rounded-sm border sm:h-3 sm:w-4"></div>
              <span>Pasillo Principal</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="border-info bg-info/20 h-2 w-3 rounded-sm border sm:h-3 sm:w-4"></div>
              <span>Área de Oficinas y Recepción</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="border-warning bg-warning/20 h-2 w-3 rounded-sm border sm:h-3 sm:w-4"></div>
              <span>Área de Carga/Descarga</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-error h-2 w-3 rounded-sm sm:h-3 sm:w-4"></div>
              <span>Salida de Emergencia</span>
            </div>
          </div>
          <div className="border-t pt-3">
            <h4 className="mb-2 text-xs font-semibold sm:text-sm">
              Instrucciones:
            </h4>
            <div className="text-base-content/60 space-y-1 text-xs">
              <div>
                • Pasa el mouse sobre las estanterías para ver información
              </div>
              <div>• Haz clic para fijar la información en pantalla</div>
              <div>• N1, N2, N3 = Niveles de la estantería</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Legend;
