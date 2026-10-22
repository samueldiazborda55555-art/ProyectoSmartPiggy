export interface Aporte {
  id: string;
  fecha: string;
  monto: number;
}

export interface Meta {
  id: string;
  nombre: string;
  icono: string;
  montoObjetivo: number;
  montoAhorrado: number;
  aportes: Aporte[];
}