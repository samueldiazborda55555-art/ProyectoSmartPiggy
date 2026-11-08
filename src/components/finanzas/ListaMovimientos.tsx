import { StyleSheet, Text, View } from "react-native";

import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import type { Movimiento } from "@/tipos/movimiento";
import { nombreMes } from "@/utilidades/formatearFecha";
import ItemMovimiento from "./ItemMovimiento";

type Props = {
  movimientos: Movimiento[];
  variante?: "inicio" | "azul";
  agruparPorMes?: boolean; // true en Movimientos y categorías; false en Inicio
};

function claveMes(iso: string) {
  const f = new Date(iso);
  return f.getFullYear() * 12 + f.getMonth();
}

export default function ListaMovimientos({
  movimientos,
  variante = "inicio",
  agruparPorMes = true,
}: Props) {
  if (!agruparPorMes) {
    return (
      <View>
        {movimientos.map((m) => (
          <ItemMovimiento key={m.id} movimiento={m} variante={variante} />
        ))}
      </View>
    );
  }

  const grupos: { clave: number; mes: string; items: Movimiento[] }[] = [];
  movimientos.forEach((m) => {
    const clave = claveMes(m.fecha);
    const grupo = grupos.find((g) => g.clave === clave);
    if (grupo) grupo.items.push(m);
    else grupos.push({ clave, mes: nombreMes(m.fecha), items: [m] });
  });

  return (
    <View>
      {grupos.map((g) => (
        <View key={g.clave}>
          <Text style={styles.mes}>{g.mes}</Text>
          {g.items.map((m) => (
            <ItemMovimiento key={m.id} movimiento={m} variante={variante} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mes: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: colores.textoPrincipal,
    marginTop: espaciado.md,
    marginBottom: espaciado.xs,
  },
});