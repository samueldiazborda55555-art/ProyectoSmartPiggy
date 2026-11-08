// src/constants/espaciado.ts
export const espaciado = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  hoja: 40, // margen lateral del contenido dentro de la hoja
} as const;

export const radios = {
  campo: 16,
  boton: 22,   // botón de 44 de alto = forma de píldora
  tarjeta: 20,
  hoja: 56,    // esquinas superiores de la hoja
  barra: 56,   // esquinas superiores de la barra inferior
} as const;

export const medidas = {
  alturaBarra: 96, // alto de la barra verde inferior (sin la zona segura)
} as const;