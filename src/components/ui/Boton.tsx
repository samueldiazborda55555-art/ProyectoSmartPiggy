// src/componentes/ui/Boton.tsx
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle,
} from "react-native";
import { colores } from "../../constants/colores";
import { radios } from "../../constants/espaciado";
import { tipografia } from "../../constants/tipografia";

type Variante = "primario" | "secundario" | "texto";

type Props = {
  texto: string;
  onPress: () => void;
  variante?: Variante;
  deshabilitado?: boolean;
  cargando?: boolean;
  estilo?: ViewStyle;
};

export default function Boton({
  texto,
  onPress,
  variante = "primario",
  deshabilitado = false,
  cargando = false,
  estilo,
}: Props) {
  const estilosPorVariante: Record<Variante, ViewStyle> = {
    primario: { backgroundColor: colores.primario },
    secundario: { backgroundColor: colores.secundario },
    texto: { backgroundColor: "transparent" },
  };

  const colorTexto = variante === "texto" ? colores.acento : colores.textoClaro;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={deshabilitado || cargando}
      onPress={onPress}
      style={[
        styles.base,
        estilosPorVariante[variante],
        (deshabilitado || cargando) && styles.deshabilitado,
        estilo,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={colorTexto} />
      ) : (
        <Text style={[tipografia.boton, { color: colorTexto }]}>
          {texto.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: radios.boton,
    alignItems: "center",
    justifyContent: "center",
  },
  deshabilitado: {
    opacity: 0.5,
  },
});
