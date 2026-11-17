import { METAS } from "@/datos-falsos-backend/metas";
import { MOSTRAR_DATOS_DE_EJEMPLO } from "@/hooks/useMovimientos";
import type { Meta } from "@/tipos/meta";

export function useMetas() {
  // TODO (Firebase): reemplazar por obtenerMetas(idUsuario) de servicioMetas
  // Usa el mismo interruptor que useMovimientos: con false no hay movimientos ni metas.
  const metas: Meta[] = MOSTRAR_DATOS_DE_EJEMPLO ? METAS : [];
  return { metas, cargando: false };
}