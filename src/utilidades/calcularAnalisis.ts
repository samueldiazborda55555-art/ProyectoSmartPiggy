import type { Movimiento } from "@/tipos/movimiento";

export type PeriodoAnalisis = "diario" | "semanal" | "mensual" | "anual";

// Misma forma que DatoBarras del gráfico, así se le puede pasar directo
export type BarraAnalisis = {
  etiqueta: string;
  ingresos: number;
  gastos: number;
};

export type ResultadoAnalisis = {
  barras: BarraAnalisis[];
  totalIngresos: number;
  totalGastos: number;
};

const DIAS_LU_A_DOM = ["lu", "ma", "mie", "ju", "vi", "sab", "dom"];
const MESES_CORTOS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];
const MS_DIA = 24 * 60 * 60 * 1000;

function inicioDelDia(f: Date) {
  return new Date(f.getFullYear(), f.getMonth(), f.getDate());
}

// Cuántos días calendario hay desde "desde" hasta "hasta" (0 = el mismo día)
function diasEntre(desde: Date, hasta: Date) {
  return Math.round((inicioDelDia(hasta).getTime() - inicioDelDia(desde).getTime()) / MS_DIA);
}

const redondear = (n: number) => Math.round(n * 100) / 100;

export function calcularAnalisis(
  movimientos: Movimiento[],
  periodo: PeriodoAnalisis,
  ahora = new Date()
): ResultadoAnalisis {
  // Cada periodo define dos cosas:
  //  - las etiquetas de sus barras
  //  - una función que dice en qué barra cae una fecha (-1 si queda fuera)
  let etiquetas: string[];
  let indiceDe: (f: Date) => number;

  if (periodo === "diario") {
    // Últimos 7 días, mostrados siempre de lu a dom.
    // En 7 días seguidos cada día de la semana aparece una sola vez,
    // así que la barra se elige por el día de la semana de la fecha.
    etiquetas = DIAS_LU_A_DOM;
    indiceDe = (f) => {
      const atras = diasEntre(f, ahora);
      return atras >= 0 && atras < 7 ? (f.getDay() + 6) % 7 : -1; // getDay(): 0 = domingo
    };
  } else if (periodo === "semanal") {
    // 4 bloques de 7 días: "semana 4" son los últimos 7 días
    etiquetas = ["semana 1", "semana 2", "semana 3", "semana 4"];
    indiceDe = (f) => {
      const atras = diasEntre(f, ahora);
      return atras >= 0 && atras < 28 ? 3 - Math.floor(atras / 7) : -1;
    };
  } else if (periodo === "mensual") {
    // Últimos 6 meses calendario, incluyendo el actual
    const base = ahora.getFullYear() * 12 + ahora.getMonth();
    etiquetas = Array.from({ length: 6 }, (_, i) => MESES_CORTOS[(base - (5 - i)) % 12]);
    indiceDe = (f) => {
      const atras = base - (f.getFullYear() * 12 + f.getMonth());
      return atras >= 0 && atras < 6 ? 5 - atras : -1;
    };
  } else {
    // Últimos 5 años, incluyendo el actual
    const anio = ahora.getFullYear();
    etiquetas = Array.from({ length: 5 }, (_, i) => String(anio - (4 - i)));
    indiceDe = (f) => {
      const atras = anio - f.getFullYear();
      return atras >= 0 && atras < 5 ? 4 - atras : -1;
    };
  }

  const barras: BarraAnalisis[] = etiquetas.map((etiqueta) => ({
    etiqueta,
    ingresos: 0,
    gastos: 0,
  }));

  movimientos.forEach((m) => {
    const i = indiceDe(new Date(m.fecha));
    if (i === -1) return; // fuera del periodo
    if (m.tipo === "ingreso") barras[i].ingresos += m.monto;
    else barras[i].gastos += m.monto;
  });

  barras.forEach((b) => {
    b.ingresos = redondear(b.ingresos);
    b.gastos = redondear(b.gastos);
  });

  return {
    barras,
    totalIngresos: redondear(barras.reduce((t, b) => t + b.ingresos, 0)),
    totalGastos: redondear(barras.reduce((t, b) => t + b.gastos, 0)),
  };
}