import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";
import { formatearMoneda } from "@/utilidades/formatearMoneda";

type Props = {
  saldoTotal: number;
  gastoTotal: number;
  colorGasto?: string;
};

function Columna({ etiqueta, valor, color }: { etiqueta: string; valor: string; color: string }) {
  return (
    <View style={styles.columna}>
      <View style={styles.etiquetaFila}>
        <Ionicons name="open-outline" size={12} color={colores.textoPrincipal} />
        <Text style={styles.etiqueta}>{etiqueta}</Text>
      </View>
      <Text style={[styles.valor, { color }]}>{valor}</Text>
    </View>
  );
}

export default function ResumenSaldo({ saldoTotal, gastoTotal, colorGasto = colores.acento }: Props) {
  return (
    <View style={styles.fila}>
      <Columna etiqueta="Saldo Total" valor={formatearMoneda(saldoTotal)} color={colores.textoPrincipal} />
      <View style={styles.divisor} />
      <Columna
        etiqueta="Gasto Total"
        valor={`-${formatearMoneda(Math.abs(gastoTotal))}`}
        color={colorGasto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  columna: {
    flex: 1,
    alignItems: "center",
  },
  etiquetaFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.xs,
  },
  etiqueta: {
    ...tipografia.pequeno,
    color: colores.textoPrincipal,
  },
  valor: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    lineHeight: 30,
  },
  divisor: {
    width: 1.5,
    height: 38,
    backgroundColor: colores.textoPrincipal,
  },
});