// app/_layout.tsx
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    useFonts,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Evita que la pantalla de carga se oculte sola mientras cargamos la fuente
SplashScreen.preventAutoHideAsync();

export default function LayoutRaiz() {
  const [fuentesCargadas, errorFuentes] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fuentesCargadas || errorFuentes) {
      SplashScreen.hideAsync();
    }
  }, [fuentesCargadas, errorFuentes]);

  if (!fuentesCargadas && !errorFuentes) {
    return null; // mientras carga, no mostramos nada (sigue el splash)
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}