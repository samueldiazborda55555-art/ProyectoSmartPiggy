
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

import { colores } from "@/constants/colores";

type Props = {
  nombre: React.ComponentProps<typeof Ionicons>["name"];
  activo: boolean;
  desplazamiento?: number;
};

export default function IconoPestana({
  nombre,
  activo,
  desplazamiento = 0,
}: Props) {
  return (
    <View
      style={[
        styles.contenedor,
        activo && styles.activo,
        {
          transform: [
            { translateX: desplazamiento },
          ],
        },
      ]}
    >
      <Ionicons
        name={nombre}
        size={25}
        color={colores.textoPrincipal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  activo: {
    backgroundColor: colores.fondoClaro,
  },
});
