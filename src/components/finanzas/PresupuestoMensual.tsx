import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colores } from "@/constants/colores";
import { usePresupuesto } from "@/hooks/usePresupuesto";
import type { Movimiento } from "@/tipos/movimiento";
import { formatearMoneda } from "@/utilidades/formatearMoneda";

import BarraProgresoPresupuesto from "./BarraProgresoPresupuesto";
import ModalPresupuesto from "./ModalPresupuesto";

type Props = {
  movimientos: Movimiento[];
};

export default function PresupuestoMensual({ movimientos }: Props) {
  const [mostrarModal, setMostrarModal] = useState(false);

  const { presupuesto, guardarPresupuesto, nombreMes, anio, mes } =
    usePresupuesto();

  // Se cuentan únicamente gastos del mes calendario actual.
  // No depende del selector diario/semanal/mensual de la lista.
  const gastoMensual = movimientos.reduce((total, movimiento) => {
    if (movimiento.tipo !== "gasto") return total;

    const fecha = new Date(movimiento.fecha);

    const correspondeAlMes =
      fecha.getFullYear() === anio && fecha.getMonth() === mes;

    return correspondeAlMes ? total + movimiento.monto : total;
  }, 0);

  const porcentaje =
    presupuesto !== null ? (gastoMensual / presupuesto) * 100 : 0;

  const porcentajeVisible = Math.round(porcentaje * 10) / 10;

  function guardar(monto: number) {
    guardarPresupuesto(monto);
    setMostrarModal(false);
  }

  function obtenerMensaje() {
    if (presupuesto === null) return "";

    if (gastoMensual > presupuesto) {
      return `Superaste tu presupuesto por ${formatearMoneda(
        gastoMensual - presupuesto,
      )}`;
    }

    if (gastoMensual === presupuesto) {
      return "Has utilizado todo tu presupuesto del mes";
    }

    return `Te quedan ${formatearMoneda(presupuesto - gastoMensual)} este mes`;
  }

  return (
    <View>
      <Pressable
        onPress={() => setMostrarModal(true)}
        accessibilityRole="button"
        accessibilityLabel={
          presupuesto === null
            ? "Definir presupuesto mensual"
            : "Editar presupuesto mensual"
        }
        style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
      >
        <Ionicons
          name={presupuesto === null ? "add-circle-outline" : "create-outline"}
          size={22}
          color={colores.acento}
        />

        <Text style={styles.textoBoton}>
          {presupuesto === null
            ? "Definir presupuesto mensual"
            : "Editar presupuesto mensual"}
        </Text>
      </Pressable>

      {presupuesto === null ? (
        <Text style={styles.ayuda}>
          Define cuánto quieres gastar como máximo este mes.
        </Text>
      ) : (
        <View style={styles.resumen}>
          <Text style={styles.mes}>{nombreMes}</Text>

          <BarraProgresoPresupuesto
            porcentaje={porcentaje}
            meta={presupuesto}
            mensaje={`Has gastado ${formatearMoneda(
              gastoMensual,
            )} de ${formatearMoneda(presupuesto)}`}
          />

          {porcentaje > 100 && (
            <Text style={styles.exceso}>Utilizado: {porcentajeVisible}%</Text>
          )}

          <Text
            style={[
              styles.disponible,
              gastoMensual > presupuesto && styles.exceso,
            ]}
          >
            {obtenerMensaje()}
          </Text>
        </View>
      )}

      <ModalPresupuesto
        visible={mostrarModal}
        mes={nombreMes}
        montoActual={presupuesto}
        onGuardar={guardar}
        onCancelar={() => setMostrarModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  boton: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 44,
    borderWidth: 1,
    borderColor: colores.acento,
    borderRadius: 12,
    backgroundColor: colores.fondoClaro,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textoBoton: {
    flexShrink: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.textoEtiqueta,
  },
  ayuda: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: colores.textoEtiqueta,
    marginTop: 10,
  },
  resumen: {
    marginTop: 12,
  },
  mes: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    color: colores.textoEtiqueta,
    marginBottom: 6,
  },
  disponible: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: colores.textoEtiqueta,
    textAlign: "center",
    marginTop: 4,
  },
  exceso: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: colores.error,
    textAlign: "center",
    marginTop: 4,
  },
  presionado: {
    opacity: 0.75,
  },
});
