import { movimientosEjemplo } from "@/datos-falsos-backend/movimientos";
import type { Movimiento } from "@/tipos/movimiento";

// true  = muestra los datos de ejemplo (usuario con datos)
// false = lista vacía (usuario nuevo)
export const MOSTRAR_DATOS_DE_EJEMPLO = true;

export function useMovimientos() {
  // TODO (Firebase): reemplazar por obtenerMovimientos(idUsuario) de servicioMovimientos
  const movimientos: Movimiento[] = MOSTRAR_DATOS_DE_EJEMPLO ? movimientosEjemplo : [];
  return { movimientos, cargando: false };
}