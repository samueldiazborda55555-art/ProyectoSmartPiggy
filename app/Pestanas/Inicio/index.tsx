import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PantallaBase from "@/components/disposicion/PantallaBase";
import ListaMovimientos from "@/components/finanzas/ListaMovimientos";
import PresupuestoMensual from "@/components/finanzas/PresupuestoMensual";
import ProgresoCircular from "@/components/finanzas/ProgresoCircular";
import ResumenSaldo from "@/components/finanzas/ResumenSaldo";
import ControlSegmentado from "@/components/ui/ControlSegmentado";
import { colores } from "@/constants/colores";
import { espaciado, radios } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";
import { useMovimientos } from "@/hooks/useMovimientos";
import { formatearMoneda } from "@/utilidades/formatearMoneda";
import type { Periodo } from "@/utilidades/resumenFinanciero";
import {
  calcularResumen,
  filtrarPorPeriodo,
} from "@/utilidades/resumenFinanciero";

const PORCENTAJE_META_DEMO = 40;

const OPCIONES_PERIODO: { valor: Periodo; etiqueta: string }[] = [
  { valor: "diario", etiqueta: "diario" },
  { valor: "semanal", etiqueta: "semanal" },
  { valor: "mensual", etiqueta: "mensual" },
];

function FilaEstadistica({
  icono,
  etiqueta,
  valor,
}: {
  icono: React.ComponentProps<typeof Ionicons>["name"];
  etiqueta: string;
  valor: string;
}) {
  return (
    <View style={styles.filaEstadistica}>
      <Ionicons name={icono} size={26} color={colores.textoPrincipal} />

      <View style={styles.textosEstadistica}>
        <Text style={styles.etiquetaEstadistica}>{etiqueta}</Text>
        <Text style={styles.valorEstadistica}>{valor}</Text>
      </View>
    </View>
  );
}

export default function Inicio() {
  const insets = useSafeAreaInsets();
  const { movimientos } = useMovimientos();
  const [periodo, setPeriodo] = useState<Periodo>("mensual");

  const hayMovimientos = movimientos.length > 0;
  const resumen = calcularResumen(movimientos);

  const visibles = filtrarPorPeriodo(movimientos, periodo);
  const porcentajeMeta = hayMovimientos ? PORCENTAJE_META_DEMO : 0;

  return (
    <PantallaBase
      conBarra
      encabezado={
        <View
          style={[
            styles.zonaSuperior,
            { paddingTop: insets.top + espaciado.md },
          ]}
        >
          <View style={styles.cabecera}>
            <View style={styles.saludo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color={colores.secundario} />
              </View>

              <Text style={styles.textoSaludo}>Hola, Bienvenido</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/Notificaciones")}
              hitSlop={10}
              style={styles.campana}
              accessibilityLabel="Ver notificaciones"
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colores.textoEtiqueta}
              />
            </TouchableOpacity>
          </View>

          <ResumenSaldo
            saldoTotal={resumen.saldo}
            gastoTotal={resumen.gastoTotal}
          />

          <PresupuestoMensual movimientos={movimientos} />
        </View>
      }
    >
      <View style={styles.tarjeta}>
        <View style={styles.metas}>
          <ProgresoCircular
            porcentaje={porcentajeMeta}
            tamano={64}
            colorFondo={hayMovimientos ? "transparent" : colores.textoPrincipal}
          >
            {hayMovimientos ? (
              <Ionicons
                name="car-outline"
                size={30}
                color={colores.textoPrincipal}
              />
            ) : (
              <Text style={styles.porcentajeMeta}>0%</Text>
            )}
          </ProgresoCircular>

          <Text style={styles.etiquetaMetas}>{"Ahorro En\nMetas"}</Text>
        </View>

        <View style={styles.divisorVertical} />

        <View style={styles.estadisticas}>
          <FilaEstadistica
            icono="cash-outline"
            etiqueta="Ingresos de la semana pasada"
            valor={formatearMoneda(resumen.ingresosSemana)}
          />

          <View style={styles.divisorHorizontal} />

          <FilaEstadistica
            icono="restaurant-outline"
            etiqueta="Comida dee la semana pasada"
            valor={`-${formatearMoneda(resumen.comidaSemana)}`}
          />
        </View>
      </View>

      {/* Visible para usuarios con movimientos y sin movimientos. */}
      <TouchableOpacity
        style={styles.botonAgregarIngreso}
        activeOpacity={0.8}
        onPress={() => router.push("/Pestanas/Inicio/Agregar-ingreso")}
        accessibilityRole="button"
        accessibilityLabel="Agregar ingresos"
      >
        <Ionicons name="add-circle" size={21} color={colores.textoClaro} />

        <Text style={styles.textoAgregarIngreso}>Agregar ingresos</Text>
      </TouchableOpacity>

      <View style={styles.selector}>
        <ControlSegmentado
          opciones={OPCIONES_PERIODO}
          seleccionado={periodo}
          onCambiar={setPeriodo}
        />
      </View>

      {!hayMovimientos ? (
        <View style={styles.vacio}>
          <View style={styles.iconoVacio}>
            <Ionicons name="wallet-outline" size={26} color={colores.acento} />
          </View>

          <Text style={styles.tituloVacio}>Aún no tienes movimientos</Text>

          <Text style={styles.textoVacio}>
            {
              "Registra tu primer ingreso o gasto aquí\nVerás el resumen de tu dinero"
            }
          </Text>
        </View>
      ) : visibles.length === 0 ? (
        <Text style={styles.sinPeriodo}>
          No hay movimientos en este periodo
        </Text>
      ) : (
        <ListaMovimientos
          movimientos={visibles}
          variante="inicio"
          agruparPorMes={false}
        />
      )}
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  zonaSuperior: {
    backgroundColor: colores.fondo,
    paddingHorizontal: espaciado.lg,
    paddingBottom: espaciado.xl,
    gap: espaciado.md,
  },
  cabecera: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  saludo: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm + 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colores.secundario,
    backgroundColor: colores.mentaClara,
    alignItems: "center",
    justifyContent: "center",
  },
  textoSaludo: {
    ...tipografia.subtitulo,
    fontSize: 17,
    color: colores.textoPrincipal,
  },
  campana: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colores.mentaClara,
    alignItems: "center",
    justifyContent: "center",
  },
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colores.fondoClaro,
    borderRadius: radios.tarjeta,
    padding: espaciado.md,
  },
  metas: {
    alignItems: "center",
    width: 92,
  },
  porcentajeMeta: {
    ...tipografia.etiqueta,
    color: colores.textoPrincipal,
  },
  etiquetaMetas: {
    ...tipografia.pequeno,
    color: colores.textoPrincipal,
    textAlign: "center",
    marginTop: espaciado.xs,
  },
  divisorVertical: {
    width: 1.5,
    alignSelf: "stretch",
    backgroundColor: colores.textoPrincipal,
    marginHorizontal: espaciado.md - 4,
  },
  estadisticas: {
    flex: 1,
  },
  divisorHorizontal: {
    height: 1.5,
    backgroundColor: colores.textoPrincipal,
    marginVertical: espaciado.sm,
  },
  filaEstadistica: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.sm,
  },
  textosEstadistica: {
    flex: 1,
  },
  etiquetaEstadistica: {
    ...tipografia.pequeno,
    fontSize: 11,
    lineHeight: 14,
    color: colores.textoPrincipal,
  },
  valorEstadistica: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    color: colores.textoPrincipal,
  },
  botonAgregarIngreso: {
    width: "100%",
    minHeight: 44,
    backgroundColor: colores.acento,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: espaciado.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textoAgregarIngreso: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: colores.textoClaro,
  },
  selector: {
    marginTop: espaciado.md,
    marginBottom: espaciado.sm,
  },
  vacio: {
    alignItems: "center",
    marginTop: espaciado.md,
    gap: espaciado.sm,
  },
  iconoVacio: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colores.fondoClaro,
    alignItems: "center",
    justifyContent: "center",
  },
  tituloVacio: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: colores.textoPrincipal,
    marginTop: espaciado.xs,
    textAlign: "center",
  },
  textoVacio: {
    ...tipografia.pequeno,
    color: colores.textoPrincipal,
    textAlign: "center",
    marginBottom: espaciado.sm,
  },
  sinPeriodo: {
    ...tipografia.texto,
    color: colores.textoSecundario,
    textAlign: "center",
    marginTop: espaciado.lg,
  },
});
