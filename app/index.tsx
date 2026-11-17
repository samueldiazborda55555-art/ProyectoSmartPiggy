// app/index.tsx
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

import { escucharSesion } from "@/servicios/servicioAutenticacion";

export default function Index() {
  const [cargando, setCargando] = useState(true);
  const [haySesion, setHaySesion] = useState(false);

  useEffect(() => {
    // escucharSesion devuelve la función para dejar de escuchar
    const cancelar = escucharSesion((usuario) => {
      setHaySesion(usuario !== null);
      setCargando(false);
    });

    // Al salir de la pantalla se deja de escuchar
    return cancelar;
  }, []);

  // Mientras Firebase responde no se dibuja nada: evita el parpadeo
  if (cargando) return null;

  return <Redirect href={haySesion ? "/Pestanas/Inicio" : "/Introduccion"} />;
}