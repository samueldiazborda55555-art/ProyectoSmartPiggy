import { Movimiento } from '../tipos/movimiento';

export const MOVIMIENTOS: Movimiento[] = [
  // Comida (del Figma)
  { id: 'm1', tipo: 'gasto', fecha: '2026-04-30T18:27:00', monto: 26, nombre: 'Cena', categoriaId: 'comida' },
  { id: 'm2', tipo: 'gasto', fecha: '2026-04-24T15:00:00', monto: 18.35, nombre: 'Domicilio Pizza', categoriaId: 'comida' },
  { id: 'm3', tipo: 'gasto', fecha: '2026-04-15T12:30:00', monto: 15.4, nombre: 'Almuerzo', categoriaId: 'comida' },
  { id: 'm4', tipo: 'gasto', fecha: '2026-04-08T09:30:00', monto: 12.13, nombre: 'Merienda', categoriaId: 'comida' },
  { id: 'm5', tipo: 'gasto', fecha: '2026-03-31T20:50:00', monto: 27.2, nombre: 'Cena', categoriaId: 'comida' },

  // Transporte (Gasolina viene de la tarjeta; el resto es inventado)
  { id: 'm6', tipo: 'gasto', fecha: '2026-04-22T07:45:00', monto: 150000, nombre: 'Gasolina', categoriaId: 'transporte' },
  { id: 'm7', tipo: 'gasto', fecha: '2026-04-10T08:10:00', monto: 2800, nombre: 'Pasaje bus', categoriaId: 'transporte' },
  { id: 'm8', tipo: 'gasto', fecha: '2026-03-18T21:30:00', monto: 18000, nombre: 'Taxi', categoriaId: 'transporte' },

  // Medicina (inventado)
  { id: 'm9', tipo: 'gasto', fecha: '2026-04-26T10:15:00', monto: 12000, nombre: 'Analgésicos', categoriaId: 'medicina' },
  { id: 'm10', tipo: 'gasto', fecha: '2026-04-12T16:00:00', monto: 55000, nombre: 'Consulta médica', categoriaId: 'medicina' },
  { id: 'm11', tipo: 'gasto', fecha: '2026-03-20T11:40:00', monto: 38000, nombre: 'Vitaminas', categoriaId: 'medicina' },

  // Alimentos (inventado)
  { id: 'm12', tipo: 'gasto', fecha: '2026-04-28T17:00:00', monto: 100000, nombre: 'Mercado semanal', categoriaId: 'alimentos' },
  { id: 'm13', tipo: 'gasto', fecha: '2026-04-14T09:20:00', monto: 32000, nombre: 'Frutas y verduras', categoriaId: 'alimentos' },
  { id: 'm14', tipo: 'gasto', fecha: '2026-03-25T07:30:00', monto: 9500, nombre: 'Panadería', categoriaId: 'alimentos' },

  // Alquiler (inventado)
  { id: 'm15', tipo: 'gasto', fecha: '2026-04-01T09:00:00', monto: 574400, nombre: 'Renta', categoriaId: 'alquiler' },
  { id: 'm16', tipo: 'gasto', fecha: '2026-04-05T10:30:00', monto: 80000, nombre: 'Administración', categoriaId: 'alquiler' },
  { id: 'm17', tipo: 'gasto', fecha: '2026-03-01T09:00:00', monto: 574400, nombre: 'Renta', categoriaId: 'alquiler' },

  // Regalos (inventado)
  { id: 'm18', tipo: 'gasto', fecha: '2026-04-18T14:00:00', monto: 45000, nombre: 'Regalo de cumpleaños', categoriaId: 'regalos' },
  { id: 'm19', tipo: 'gasto', fecha: '2026-03-14T11:00:00', monto: 22000, nombre: 'Flores', categoriaId: 'regalos' },
  { id: 'm20', tipo: 'gasto', fecha: '2026-03-02T16:45:00', monto: 30000, nombre: 'Tarjeta de regalo', categoriaId: 'regalos' },

  // Ahorros (inventado)
  { id: 'm21', tipo: 'gasto', fecha: '2026-04-29T10:00:00', monto: 100000, nombre: 'Aporte al viaje', categoriaId: 'ahorros' },
  { id: 'm22', tipo: 'gasto', fecha: '2026-04-15T10:00:00', monto: 200000, nombre: 'Aporte nueva casa', categoriaId: 'ahorros' },
  { id: 'm23', tipo: 'gasto', fecha: '2026-03-30T10:00:00', monto: 150000, nombre: 'Ahorro mensual', categoriaId: 'ahorros' },

  // Entretenimiento (inventado)
  { id: 'm24', tipo: 'gasto', fecha: '2026-04-27T19:30:00', monto: 24000, nombre: 'Cine', categoriaId: 'entretenimiento' },
  { id: 'm25', tipo: 'gasto', fecha: '2026-04-09T08:00:00', monto: 33000, nombre: 'Suscripción streaming', categoriaId: 'entretenimiento' },
  { id: 'm26', tipo: 'gasto', fecha: '2026-03-22T20:00:00', monto: 120000, nombre: 'Concierto', categoriaId: 'entretenimiento' },

  // Más (inventado)
  { id: 'm27', tipo: 'gasto', fecha: '2026-04-17T15:00:00', monto: 15000, nombre: 'Gasto varios', categoriaId: 'mas' },
  { id: 'm28', tipo: 'gasto', fecha: '2026-03-10T12:00:00', monto: 10000, nombre: 'Donación', categoriaId: 'mas' },
];