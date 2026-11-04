// app/Autenticacion/exito.tsx
import { Href, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

import PantallaExito from "@/components/ui/PantallaExito";

export default function Exito() {
  const { mensaje, destino } = useLocalSearchParams<{
    mensaje?: string;
    destino?: string;
  }>();

  useEffect(() => {
    const temporizador = setTimeout(() => {
      router.replace((destino ?? "/Autenticacion/Iniciar-sesion") as Href);
    }, 2000);

    return () => clearTimeout(temporizador);
  }, [destino]);

  return (
    <PantallaExito
      mensaje={mensaje ?? "La acción se ha completado correctamente."}
    />
  );
}