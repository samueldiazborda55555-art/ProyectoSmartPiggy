import type { Movimiento } from "@/tipos/movimiento";

export type Periodo = "diario" | "semanal" | "mensual";

const DIAS: Record<Periodo, number> = { diario: 1, semanal: 7, mensual: 30 };
const MS_DIA = 24 * 60 * 60 * 1000;
const CATEGORIAS_COMIDA = ["comida", "alimentos"];

const suma = (lista: Movimiento[]) => lista.reduce((total, m) => total + m.monto, 0);

export function filtrarPorPeriodo(movs: Movimiento[], periodo: Periodo, ahora = new Date()) {
  const desde = ahora.getTime() - DIAS[periodo] * MS_DIA;
  return movs
    .filter((m) => new Date(m.fecha).getTime() >= desde)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function calcularResumen(movs: Movimiento[], ahora = new Date()) {
  const ingresos = suma(movs.filter((m) => m.tipo === "ingreso"));
  const gastos = suma(movs.filter((m) => m.tipo === "gasto"));
  const semana = filtrarPorPeriodo(movs, "semanal", ahora);

  return {
    saldo: ingresos - gastos,
    gastoTotal: gastos,
    ingresosSemana: suma(semana.filter((m) => m.tipo === "ingreso")),
    comidaSemana: suma(
      semana.filter((m) => m.tipo === "gasto" && CATEGORIAS_COMIDA.includes(m.categoriaId))
    ),
  };
}

export function mensajePresupuesto(porcentaje: number, hayMovimientos: boolean): string {
  if (!hayMovimientos) return "Aun No Has Registrado Gastos";
  if (porcentaje <= 50) return `El ${porcentaje}% De Tus Gastos, Se Ven Bien.`;
  if (porcentaje <= 80) return `Ya Vas En El ${porcentaje}% De Tu Presupuesto, Cuidado.`;
  return `Llevas El ${porcentaje}% De Tu Presupuesto, Ojo Con Los Gastos.`;
}