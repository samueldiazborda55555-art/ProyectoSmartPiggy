import { StyleSheet, Text, View } from "react-native";

import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";
import { formatearMoneda } from "@/utilidades/formatearMoneda";

type Props = {
  porcentaje: number; // 0 a 100
  meta: number;       // monto del presupuesto
  mensaje: string;
};

export default function BarraProgresoPresupuesto({ porcentaje, meta, mensaje }: Props) {
  const p = Math.max(0, Math.min(100, porcentaje));

  return (
    <View>
      <View style={styles.pista}>
        <View style={[styles.relleno, { width: `${p}%` as `${number}%` }]} />
        <View style={styles.textos}>
          <Text style={[styles.porcentaje, { color: p >= 12 ? colores.textoClaro : colores.textoPrincipal }]}>
            {p}%
          </Text>
          <Text style={styles.meta}>{formatearMoneda(meta)}</Text>
        </View>
      </View>
      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pista: {
    height: 22,
    borderRadius: 11,
    backgroundColor: colores.verdeProgreso,
    overflow: "hidden",
    justifyContent: "center",
  },
  relleno: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colores.acento,
    borderRadius: 11,
  },
  textos: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: espaciado.sm + 2,
  },
  porcentaje: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
  },
  meta: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: colores.textoPrincipal,
  },
  mensaje: {
    ...tipografia.pequeno,
    fontSize: 13,
    color: colores.textoPrincipal,
    textAlign: "center",
    marginTop: espaciado.sm + 2,
  },
});