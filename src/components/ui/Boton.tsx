import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import { colores } from "@/constants/colores";
import { radios } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";

type Variante = "primario" | "secundario" | "accion" | "texto";

type Props = {
  texto: string;
  onPress: () => void;
  variante?: Variante;
  deshabilitado?: boolean;
  cargando?: boolean;
  mayusculas?: boolean;
  ancho?: "auto" | "completo";
  estilo?: ViewStyle;
};

const COLORES: Record<Variante, { fondo: string; texto: string }> = {
  primario: { fondo: colores.primario, texto: colores.textoClaro },
  secundario: { fondo: colores.secundario, texto: colores.textoClaro },
  accion: { fondo: colores.acento, texto: colores.textoPrincipal },
  texto: { fondo: "transparent", texto: colores.primario },
};

export default function Boton({
  texto,
  onPress,
  variante = "primario",
  deshabilitado = false,
  cargando = false,
  mayusculas = false,
  ancho = "auto",
  estilo,
}: Props) {
  const paleta = COLORES[variante];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={deshabilitado || cargando}
      onPress={onPress}
      style={[
        styles.base,
        { backgroundColor: paleta.fondo },
        ancho === "completo" && styles.completo,
        (deshabilitado || cargando) && styles.deshabilitado,
        estilo,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={paleta.texto} />
      ) : (
        <Text style={[tipografia.boton, { color: paleta.texto }]}>
          {mayusculas ? texto.toUpperCase() : texto}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "center",
    minWidth: 206,
    height: 44,
    paddingHorizontal: 28,
    borderRadius: radios.boton,
    alignItems: "center",
    justifyContent: "center",
  },
  completo: {
    alignSelf: "stretch",
    width: "100%",
  },
  deshabilitado: {
    opacity: 0.5,
  },
});