import { Meta } from '../tipos/meta';

export const METAS: Meta[] = [
  {
    id: 'viaje',
    nombre: 'Viaje',
    icono: 'airplane',
    montoObjetivo: 1962.93,
    montoAhorrado: 653.31,
    aportes: [
      { id: 'a1', fecha: '2026-04-30T10:56:00', monto: 217.77 },
      { id: 'a2', fecha: '2026-04-14T17:42:00', monto: 217.77 },
      { id: 'a3', fecha: '2026-04-03T12:30:00', monto: 217.77 },
    ],
  },
  {
    id: 'nueva-casa',
    nombre: 'Nueva casa',
    icono: 'home-outline',
    montoObjetivo: 569200,
    montoAhorrado: 625.48,
    aportes: [
      { id: 'a4', fecha: '2026-04-11T19:56:00', monto: 300 },
      { id: 'a5', fecha: '2026-01-18T20:25:00', monto: 200 },
      { id: 'a6', fecha: '2026-01-02T15:56:00', monto: 125.48 },
    ],
  },
  {
    id: 'carro',
    nombre: 'Carro',
    icono: 'car-outline',
    montoObjetivo: 14390,
    montoAhorrado: 596.25,
    aportes: [
      { id: 'a7', fecha: '2026-04-20T09:15:00', monto: 300 },
      { id: 'a8', fecha: '2026-03-10T18:40:00', monto: 196.25 },
      { id: 'a9', fecha: '2026-02-05T11:00:00', monto: 100 },
    ],
  },
  {
    id: 'boda',
    nombre: 'Boda',
    icono: 'ring',
    montoObjetivo: 34700,
    montoAhorrado: 296.25,
    aportes: [
      { id: 'a10', fecha: '2026-04-25T14:20:00', monto: 150 },
      { id: 'a11', fecha: '2026-03-15T16:10:00', monto: 100 },
      { id: 'a12', fecha: '2026-02-12T10:30:00', monto: 46.25 },
    ],
  },
];