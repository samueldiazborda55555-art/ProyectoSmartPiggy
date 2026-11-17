import { CATEGORIAS } from "@/constants/categorias";
import type { Movimiento } from "@/tipos/movimiento";

export type PorcionCategoria = {
  categoriaId: string;
  nombre: string;
  monto: number;
  porcentaje: number; // entero; todos los porcentajes suman exactamente 100
};

function nombreDe(id: string): string {
  const categoria = CATEGORIAS.find((c) => c.id === id);
  if (categoria) return categoria.nombre;
  // Categorías nuevas (tarea 9): se muestra el id con la primera letra en mayúscula
  return id.charAt(0).toUpperCase() + id.slice(1);
}

// Suma los gastos del mes de "fecha" por categoría y calcula el porcentaje de cada una.
// Si hay más de "maxPorciones" categorías, las más pequeñas se agrupan en "Otros".
export function calcularGastosPorCategoria(
  movimientos: Movimiento[],
  fecha = new Date(),
  maxPorciones = 4
): PorcionCategoria[] {
  const anio = fecha.getFullYear();
  const mes = fecha.getMonth();

  // 1. Sumar los gastos de ese mes por categoría
  const sumas = new Map<string, number>();
  movimientos.forEach((m) => {
    if (m.tipo !== "gasto") return;
    const f = new Date(m.fecha);
    if (f.getFullYear() !== anio || f.getMonth() !== mes) return;
    sumas.set(m.categoriaId, (sumas.get(m.categoriaId) ?? 0) + m.monto);
  });

  // 2. Ordenar de mayor a menor y agrupar las pequeñas en "Otros"
  let porciones = [...sumas.entries()]
    .map(([categoriaId, monto]) => ({ categoriaId, nombre: nombreDe(categoriaId), monto }))
    .sort((a, b) => b.monto - a.monto);

  if (porciones.length > maxPorciones) {
    const principales = porciones.slice(0, maxPorciones - 1);
    const resto = porciones.slice(maxPorciones - 1);
    porciones = [
      ...principales,
      { categoriaId: "otros", nombre: "Otros", monto: resto.reduce((t, p) => t + p.monto, 0) },
    ];
  }

  const total = porciones.reduce((t, p) => t + p.monto, 0);
  if (total <= 0) return [];

  // 3. Porcentajes enteros que suman exactamente 100:
  //    se redondea hacia abajo y los puntos que faltan se reparten
  //    entre las porciones con mayor parte decimal.
  const exactos = porciones.map((p) => (p.monto / total) * 100);
  const porcentajes = exactos.map((e) => Math.floor(e));
  let faltan = 100 - porcentajes.reduce((t, p) => t + p, 0);
  exactos
    .map((e, i) => ({ i, resto: e - Math.floor(e) }))
    .sort((a, b) => b.resto - a.resto)
    .forEach(({ i }) => {
      if (faltan > 0) {
        porcentajes[i] += 1;
        faltan -= 1;
      }
    });

  return porciones.map((p, i) => ({
    ...p,
    monto: Math.round(p.monto * 100) / 100,
    porcentaje: porcentajes[i],
  }));
}