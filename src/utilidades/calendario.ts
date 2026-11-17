import type { Movimiento } from "@/tipos/movimiento";

export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Cuántos días tiene el mes (el día 0 del mes siguiente es el último de este)
export function diasDelMes(anio: number, mes: number): number {
  return new Date(anio, mes + 1, 0).getDate();
}

// En qué columna cae el día 1: 0 = lunes ... 6 = domingo
// (JavaScript cuenta 0 = domingo, por eso se corre un lugar)
export function primerDiaDelMes(anio: number, mes: number): number {
  return (new Date(anio, mes, 1).getDay() + 6) % 7;
}

// Lista de celdas de la cuadrícula: null = celda vacía, número = día del mes
export function generarCeldas(anio: number, mes: number): (number | null)[] {
  const vacios: (number | null)[] = Array(primerDiaDelMes(anio, mes)).fill(null);
  const dias = Array.from({ length: diasDelMes(anio, mes) }, (_, i) => i + 1);
  const celdas = [...vacios, ...dias];
  while (celdas.length % 7 !== 0) celdas.push(null); // completa la última semana
  return celdas;
}

function esDelMes(iso: string, anio: number, mes: number) {
  const f = new Date(iso);
  return f.getFullYear() === anio && f.getMonth() === mes;
}

// Días del mes que tienen al menos un movimiento (para el puntito)
export function diasConMovimientos(movimientos: Movimiento[], anio: number, mes: number): Set<number> {
  const dias = new Set<number>();
  movimientos.forEach((m) => {
    if (esDelMes(m.fecha, anio, mes)) dias.add(new Date(m.fecha).getDate());
  });
  return dias;
}

// Movimientos de un día, del más reciente al más antiguo
export function movimientosDelDia(
  movimientos: Movimiento[],
  anio: number,
  mes: number,
  dia: number
): Movimiento[] {
  return movimientos
    .filter((m) => esDelMes(m.fecha, anio, mes) && new Date(m.fecha).getDate() === dia)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}