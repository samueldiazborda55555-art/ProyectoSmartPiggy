import { useMemo } from "react";

import type { Movimiento } from "@/tipos/movimiento";
import { calcularAnalisis, PeriodoAnalisis } from "@/utilidades/calcularAnalisis";

export function useAnalisis(movimientos: Movimiento[], periodo: PeriodoAnalisis) {
  return useMemo(() => calcularAnalisis(movimientos, periodo), [movimientos, periodo]);
}