import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import type { Movimiento } from "@/tipos/movimiento";
import { formatearFechaHora } from "@/utilidades/formatearFecha";
import { formatearMoneda } from "@/utilidades/formatearMoneda";

type NombreIcono = React.ComponentProps<typeof Ionicons>["name"];

// Ajusta los ids para que coincidan con los de constants/categorias.ts
const ICONOS: Record<string, NombreIcono> = {
  ingresos: "cash-outline",
  comida: "restaurant-outline",
  alimentos: "basket-outline",
  transporte: "bus-outline",
  alquiler: "key-outline",
  medicina: "medkit-outline",
  regalos: "gift-outline",
  ahorros: "wallet-outline",
  entretenimiento: "ticket-outline",
};

type Props = {
  movimiento: Movimiento;
  variante?: "inicio" | "azul"; // inicio = cuadros verdes; azul = Movimientos y categorías
  onPress?: () => void;
};

export default function ItemMovimiento({ movimiento, variante = "inicio", onPress }: Props) {
  const esGasto = movimiento.tipo === "gasto";
  const azul = variante === "azul";
  const monto = esGasto ? `-${formatearMoneda(movimiento.monto)}` : formatearMoneda(movimiento.monto);

  return (
    <TouchableOpacity activeOpacity={onPress ? 0.7 : 1} onPress={onPress} style={styles.fila}>
      <View style={[styles.icono, { backgroundColor: azul ? colores.azulClaro : colores.verdeIcono }]}>
        <Ionicons
          name={ICONOS[movimiento.categoriaId] ?? "ellipse-outline"}
          size={24}
          color={colores.textoClaro}
        />
      </View>

      <View style={styles.textos}>
        <Text style={styles.nombre} numberOfLines={1}>{movimiento.nombre}</Text>
        <Text style={[styles.fecha, { color: azul ? colores.azul : colores.textoPrincipal }]}>
          {formatearFechaHora(movimiento.fecha)}
        </Text>
      </View>

      {!!movimiento.mensaje && (
        <>
          <View style={styles.divisor} />
          <Text style={styles.etiqueta} numberOfLines={1}>{movimiento.mensaje}</Text>
          <View style={styles.divisor} />
        </>
      )}

      <Text
        style={[styles.monto, { color: azul && esGasto ? colores.azul : colores.textoPrincipal }]}
        numberOfLines={1}
      >
        {monto}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: espaciado.sm + 2,
  },
  icono: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: espaciado.md - 4,
  },
  textos: {
    flex: 1,
  },
  nombre: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: colores.textoPrincipal,
  },
  fecha: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
  },
  divisor: {
    width: 1.5,
    height: 28,
    backgroundColor: colores.textoPrincipal,
    marginHorizontal: espaciado.sm,
  },
  etiqueta: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: colores.textoPrincipal,
    minWidth: 62,
    textAlign: "center",
  },
  monto: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    minWidth: 78,
    textAlign: "right",
  },
});