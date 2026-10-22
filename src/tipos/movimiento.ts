import { CategoriaId } from './categoria';

export type TipoMovimiento = 'ingreso' | 'gasto';

export interface Movimiento {
  id: string;
  tipo: TipoMovimiento;
  fecha: string;
  monto: number;
  nombre: string;
  categoriaId: CategoriaId;
  mensaje?: string;
}