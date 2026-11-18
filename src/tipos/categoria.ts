export type CategoriaId =
  | 'ingresos'
  | 'comida'
  | 'transporte'
  | 'medicina'
  | 'alimentos'
  | 'alquiler'
  | 'regalos'
  | 'ahorros'
  | 'entretenimiento'
  | 'personalizada'
  | 'mas';

export interface Categoria {
  id: CategoriaId;
  nombre: string;
  icono: string;
}