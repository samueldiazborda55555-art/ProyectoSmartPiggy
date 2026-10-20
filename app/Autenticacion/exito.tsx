// app/(autenticacion)/exito.tsx
import { useLocalSearchParams } from "expo-router";
import PantallaExito from "../../src/components/ui/PantallaExito";

// Se navega así: router.push({ pathname: "/exito", params: { mensaje: "..." } })
export default function Exito() {
  const { mensaje } = useLocalSearchParams<{ mensaje?: string }>();

  return (
    <PantallaExito
      mensaje={mensaje ?? "La acción se ha completado correctamente."}
    />
  );
}
