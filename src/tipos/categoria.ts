export type CategoriaId =
  | 'comida'
  | 'transporte'
  | 'medicina'
  | 'alimentos'
  | 'alquiler'
  | 'regalos'
  | 'ahorros'
  | 'entretenimiento'
  | 'mas';

export interface Categoria {
  id: CategoriaId;
  nombre: string;
  icono: string;
}