import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colores } from "@/constants/colores";

type Opcion<T extends string> = { valor: T; etiqueta: string };

type Props<T extends string> = {
  opciones: Opcion<T>[];
  seleccionado: T;
  onCambiar: (valor: T) => void;
};

export default function ControlSegmentado<T extends string>({
  opciones,
  seleccionado,
  onCambiar,
}: Props<T>) {
  return (
    <View style={styles.contenedor}>
      {opciones.map((o) => {
        const activo = o.valor === seleccionado;
        return (
          <TouchableOpacity
            key={o.valor}
            style={[styles.opcion, activo && styles.opcionActiva]}
            onPress={() => onCambiar(o.valor)}
            activeOpacity={0.8}
          >
            <Text style={[styles.texto, activo && styles.textoActivo]}>{o.etiqueta}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    backgroundColor: colores.gris,
    borderRadius: 22,
    padding: 4,
  },
  opcion: {
    flex: 1,
    height: 38,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  opcionActiva: {
    backgroundColor: colores.acento,
  },
  texto: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: colores.textoPrincipal,
  },
  textoActivo: {
    fontFamily: "Poppins_500Medium",
    color: colores.textoClaro,
  },
});