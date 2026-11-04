// src/constants/colores.ts
export const colores = {
  // ---- Marca ----
  primario: "#558C68",       // botones verdes (iniciar sesión, siguiente, aceptar)
  secundario: "#3B5E84",     // botones azules (registrarse, enviar de nuevo)
  acento: "#109656",         // verde fuerte: barra inferior, progreso, selector, botones dentro de la app
  menta: "#00D09E",          // interruptor encendido, botón del modal
  mentaApagada: "#72DFC7",   // interruptor apagado
  mentaClara: "#DFF7E2",     // círculo de la campana, botón cancelar del modal
  verdeProgreso: "#CBDFBB",  // fondo de las barras de progreso
  verdeIcono: "#7DB456",     // cuadros de ícono en la lista del inicio

  // ---- Azules de la app ----
  azul: "#0068FF",           // categoría activa, montos de gastos
  azulMedio: "#3299FF",
  azulClaro: "#6DB6FE",      // cuadros de categorías y metas

  // ---- Fondos ----
  fondo: "#FEFEFE",          // fondo de pantalla y zona del título
  hojaClara: "#E9EFF2",      // hoja redondeada de formularios y listas
  fondoClaro: "#FFFFFF",     // campos de texto y tarjetas
  gris: "#D1D1D6",           // fondo del selector diario/semanal/mensual

  // ---- Texto ----
  textoPrincipal: "#031314",
  textoEtiqueta: "#093030",
  textoSecundario: "#93A8A8", // placeholders y puntos de contraseña
  textoClaro: "#FFFFFF",

  // ---- Estados ----
  error: "#D85A30",
  exito: "#109656",
  borde: "#D1D1D6",
} as const;