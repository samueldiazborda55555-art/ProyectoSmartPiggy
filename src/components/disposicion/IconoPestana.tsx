import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

import { colores } from "@/constants/colores";

type Props = {
  nombre: React.ComponentProps<typeof Ionicons>["name"];
  activo: boolean;
};

// Cuadro blanco detrás del ícono de la pestaña activa, como en el Figma
export default function IconoPestana({ nombre, activo }: Props) {
  return (
    <View style={[styles.contenedor, activo && styles.activo]}>
      <Ionicons name={nombre} size={28} color={colores.textoPrincipal} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  activo: {
    backgroundColor: colores.fondoClaro,
  },
});