import { IconBuildingWarehouse, IconScale } from "@tabler/icons-react";

const HeaderMap = () => {
  return (
    <div className="flex flex-col gap-3 text-xl font-semibold sm:flex-row sm:items-center sm:text-2xl">
      <IconBuildingWarehouse className="text-primary size-6 sm:size-8" />
      <div>
        <div>Mapa de Bodegas</div>
        <div className="text-base-content/60 text-xs font-normal sm:text-sm">
          Maestranzas Unidos S.A. - Sistema de Control de Inventarios
        </div>
      </div>
      <div className="text-base-content/60 mt-auto flex h-full items-center gap-2 text-xs sm:ml-auto sm:text-sm">
        <IconScale className="size-3 sm:size-4" />
        <span>Escala: 1:200</span>
      </div>
    </div>
  );
};

export default HeaderMap;
