import { useSyncExternalStore } from "react";

type Presupuestos = Record<string, number>;

let presupuestos: Presupuestos = {};
const suscriptores = new Set<() => void>();

function suscribir(callback: () => void) {
  suscriptores.add(callback);

  return () => {
    suscriptores.delete(callback);
  };
}

function obtenerEstado() {
  return presupuestos;
}

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function usePresupuesto() {
  const estado = useSyncExternalStore(suscribir, obtenerEstado, obtenerEstado);

  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth();

  const claveMes = `${anio}-${String(mes + 1).padStart(2, "0")}`;
  const nombreMes = `${MESES[mes]} ${anio}`;

  const presupuesto = estado[claveMes] ?? null;

  function guardarPresupuesto(monto: number) {
    if (!Number.isFinite(monto) || monto <= 0) {
      throw new Error("El presupuesto debe ser mayor que cero");
    }

    presupuestos = {
      ...presupuestos,
      [claveMes]: monto,
    };

    suscriptores.forEach((callback) => callback());
  }

  return {
    presupuesto,
    guardarPresupuesto,
    nombreMes,
    anio,
    mes,
  };
}
