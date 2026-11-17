import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import ListaMovimientos from "@/components/finanzas/ListaMovimientos";
import { colores } from "@/constants/colores";
import { espaciado, radios } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";
import { useMovimientos } from "@/hooks/useMovimientos";
import type { TipoMovimiento } from "@/tipos/movimiento";
import { formatearMoneda } from "@/utilidades/formatearMoneda";
import { calcularResumen } from "@/utilidades/resumenFinanciero";

type NombreIcono = React.ComponentProps<typeof Ionicons>["name"];

type PropsTarjetaTotal = {
  icono: NombreIcono;
  colorIcono: string;
  girarIcono?: boolean; // gira el ícono 90° para que la flecha apunte hacia abajo
  etiqueta: string;
  valor: string;
  colorValor: string;
  activa: boolean; // true = filtro puesto: la tarjeta se pinta de azul
  onPress: () => void;
};

function TarjetaTotal({
  icono,
  colorIcono,
  girarIcono = false,
  etiqueta,
  valor,
  colorValor,
  activa,
  onPress,
}: PropsTarjetaTotal) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: activa }}
      style={[styles.tarjetaTotal, activa && styles.tarjetaActiva]}
    >
      <Ionicons
        name={icono}
        size={24}
        color={activa ? colores.textoClaro : colorIcono}
        style={girarIcono ? { transform: [{ rotate: "90deg" }] } : undefined}
      />
      <Text style={[styles.etiquetaTarjeta, activa && { color: colores.textoClaro }]}>
        {etiqueta}
      </Text>
      <Text style={[styles.valorTarjeta, { color: activa ? colores.textoClaro : colorValor }]}>
        {valor}
      </Text>
    </TouchableOpacity>
  );
}

export default function Movimientos() {
  const { movimientos } = useMovimientos();
  const resumen = calcularResumen(movimientos);

  // null = todos | "ingreso" = solo ingresos | "gasto" = solo gastos
  const [filtro, setFiltro] = useState<TipoMovimiento | null>(null);

  // Si tocas la tarjeta que ya está activa, se quita el filtro
  const alternarFiltro = (tipo: TipoMovimiento) => {
    setFiltro((actual) => (actual === tipo ? null : tipo));
  };

  // ListaMovimientos agrupa por mes en el orden en que llegan,
  // así que los pasamos del más reciente al más antiguo.
  const ordenados = [...movimientos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  const visibles = filtro ? ordenados.filter((m) => m.tipo === filtro) : ordenados;

  return (
    <PantallaBase
      conBarra
      encabezado={
        <View>
          <EncabezadoPantalla titulo="Movimientos" />

          <View style={styles.zonaResumen}>
            <View style={styles.tarjetaSaldo}>
              <Text style={styles.etiquetaTarjeta}>Saldo Total</Text>
              <Text style={styles.valorSaldo}>{formatearMoneda(resumen.saldo)}</Text>
            </View>

            <View style={styles.filaTotales}>
              <TarjetaTotal
                icono="open-outline"
                colorIcono={colores.acento}
                etiqueta="Ingreso"
                valor={formatearMoneda(resumen.ingresoTotal)}
                colorValor={colores.textoPrincipal}
                activa={filtro === "ingreso"}
                onPress={() => alternarFiltro("ingreso")}
              />
              <TarjetaTotal
                icono="open-outline"
                colorIcono={colores.azul}
                girarIcono
                etiqueta="Gastos"
                valor={formatearMoneda(resumen.gastoTotal)}
                colorValor={colores.azul}
                activa={filtro === "gasto"}
                onPress={() => alternarFiltro("gasto")}
              />
            </View>
          </View>
        </View>
      }
    >
      {ordenados.length === 0 ? (
        <Text style={styles.vacio}>Aún no tienes movimientos</Text>
      ) : (
        <View>
          {visibles.length === 0 ? (
            <Text style={styles.vacio}>
              {filtro === "ingreso" ? "No tienes ingresos registrados" : "No tienes gastos registrados"}
            </Text>
          ) : (
            <ListaMovimientos movimientos={visibles} variante="azul" />
          )}

          {/* Botón del calendario: queda a la derecha del primer mes */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.botonCalendario}
            onPress={() => router.push("/Pestanas/Movimientos/Calendario" as any)}
          >
            <Ionicons name="calendar-outline" size={16} color={colores.textoClaro} />
          </TouchableOpacity>
        </View>
      )}
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  zonaResumen: {
    backgroundColor: colores.fondo,
    paddingHorizontal: espaciado.lg,
    paddingBottom: espaciado.lg,
    gap: espaciado.sm + 2,
  },
  tarjetaSaldo: {
    backgroundColor: colores.gris,
    borderRadius: radios.tarjeta,
    alignItems: "center",
    paddingVertical: espaciado.sm + 4,
  },
  filaTotales: {
    flexDirection: "row",
    gap: espaciado.sm + 2,
  },
  tarjetaTotal: {
    flex: 1,
    backgroundColor: colores.gris,
    borderRadius: radios.tarjeta,
    alignItems: "center",
    paddingVertical: espaciado.sm + 4,
  },
  tarjetaActiva: {
    backgroundColor: colores.azul,
  },
  etiquetaTarjeta: {
    ...tipografia.pequeno,
    color: colores.textoPrincipal,
  },
  valorSaldo: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    lineHeight: 30,
    color: colores.textoPrincipal,
  },
  valorTarjeta: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    lineHeight: 22,
  },
  botonCalendario: {
    position: "absolute",
    top: espaciado.md - 4,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colores.acento,
    alignItems: "center",
    justifyContent: "center",
  },
  vacio: {
    ...tipografia.texto,
    color: colores.textoSecundario,
    textAlign: "center",
    marginTop: espaciado.lg,
  },
});