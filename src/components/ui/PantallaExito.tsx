import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";

type Props = {
  mensaje: string;
};

export default function PantallaExito({ mensaje }: Props) {
  const { width } = useWindowDimensions();
  const d = Math.min(width * 0.35, 160); // diámetro del círculo

  return (
    <View style={styles.contenedor}>
      <View
        style={{
          width: d,
          height: d,
          borderRadius: d / 2,
          borderWidth: d * 0.04,
          borderColor: colores.textoPrincipal,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: d * 0.13,
            height: d * 0.13,
            borderRadius: d * 0.065,
            backgroundColor: colores.textoPrincipal,
            marginLeft: d * 0.2,
          }}
        />
      </View>

      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espaciado.xl,
  },
  mensaje: {
    ...tipografia.subtitulo,
    color: colores.textoPrincipal,
    textAlign: "center",
    marginTop: espaciado.xl,
  },
});