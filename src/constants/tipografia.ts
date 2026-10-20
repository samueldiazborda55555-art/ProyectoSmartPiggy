// src/constantes/tipografia.ts
// Tamaños y pesos de texto que se repiten en el Figma.
// Requiere: npx expo install @expo-google-fonts/poppins expo-font

export const tipografia = {
  titulo: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    lineHeight: 32,
  },
  subtitulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    lineHeight: 26,
  },
  texto: {
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  etiqueta: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    lineHeight: 18,
  },
  boton: {
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  pequeno: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
} as const;
