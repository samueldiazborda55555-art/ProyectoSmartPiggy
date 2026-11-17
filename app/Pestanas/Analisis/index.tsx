import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PantallaBase from "@/components/disposicion/PantallaBase";
import BarraProgresoPresupuesto from "@/components/finanzas/BarraProgresoPresupuesto";
import GraficoIngresosGastos from "@/components/finanzas/GraficoIngresosGastos";
import MisObjetivos from "@/components/finanzas/MisObjetivos";
import ResumenSaldo from "@/components/finanzas/ResumenSaldo";
import ControlSegmentado from "@/components/ui/ControlSegmentado";
import { colores } from "@/constants/colores";
import { espaciado, radios } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";
import { useAnalisis } from "@/hooks/useAnalisis";
import { useMovimientos } from "@/hooks/useMovimientos";
import { PeriodoAnalisis } from "@/utilidades/calcularAnalisis";
import { formatearMoneda } from "@/utilidades/formatearMoneda";
import { calcularResumen, mensajePresupuesto } from "@/utilidades/resumenFinanciero";

// TODO: saldrá de Firebase (es el mismo valor que usa Inicio)
const PRESUPUESTO_MENSUAL = 20000;

const OPCIONES_PERIODO: { valor: PeriodoAnalisis; etiqueta: string }[] = [
  { valor: "diario", etiqueta: "diario" },
  { valor: "semanal", etiqueta: "semanal" },
  { valor: "mensual", etiqueta: "mensual" },
  { valor: "anual", etiqueta: "anual" },
];

type PropsTotal = {
  etiqueta: string;
  valor: string;
  colorIcono: string;
  colorValor: string;
  girarIcono?: boolean; // gira el ícono para que la flecha apunte hacia abajo
};

function TotalAnalisis({ etiqueta, valor, colorIcono, colorValor, girarIcono = false }: PropsTotal) {
  return (
    <View style={styles.totalColumna}>
      <Ionicons
        name="open-outline"
        size={24}
        color={colorIcono}
        style={girarIcono ? { transform: [{ rotate: "90deg" }] } : undefined}
      />
      <Text style={styles.etiquetaTotal}>{etiqueta}</Text>
      <Text style={[styles.valorTotal, { color: colorValor }]}>{valor}</Text>
    </View>
  );
}

export default function Analisis() {
  const insets = useSafeAreaInsets();
  const { movimientos } = useMovimientos();
  const [periodo, setPeriodo] = useState<PeriodoAnalisis>("diario");

  // Barras y totales del periodo elegido (la función de la tarea 4)
  const { barras, totalIngresos, totalGastos } = useAnalisis(movimientos, periodo);

  const hayMovimientos = movimientos.length > 0;
  const resumen = calcularResumen(movimientos);
  const porcentaje = hayMovimientos
    ? Math.min(100, Math.round((resumen.gastoTotal / PRESUPUESTO_MENSUAL) * 100))
    : 0;

  return (
    <PantallaBase
      conBarra
      encabezado={
        <View style={[styles.zonaSuperior, { paddingTop: insets.top + espaciado.md }]}>
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
            >
              <Ionicons name="notifications-outline" size={20} color={colores.textoEtiqueta} />
            </TouchableOpacity>
          </View>

          <ResumenSaldo saldoTotal={resumen.saldo} gastoTotal={resumen.gastoTotal} />

          <BarraProgresoPresupuesto
            porcentaje={porcentaje}
            meta={hayMovimientos ? PRESUPUESTO_MENSUAL : 0}
            mensaje={mensajePresupuesto(porcentaje, hayMovimientos)}
          />
        </View>
      }
    >
      <View style={styles.selector}>
        <ControlSegmentado
          opciones={OPCIONES_PERIODO}
          seleccionado={periodo}
          onCambiar={setPeriodo}
        />
      </View>

      <View>
        {hayMovimientos ? (
          <GraficoIngresosGastos titulo="Ingresos Y Gastos" datos={barras} />
        ) : (
          <View style={styles.tarjetaVacia}>
            <Text style={styles.tituloVacio}>Aún no tienes movimientos</Text>
            <Text style={styles.textoVacio}>
              Registra un ingreso o un gasto para ver tu análisis
            </Text>
          </View>
        )}

        {/* Íconos verdes arriba a la derecha de la tarjeta (buscar y calendario) */}
        <View style={styles.acciones}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.botonAccion}
            onPress={() => {
              // TODO: abrir la pantalla "Agregar Gastos" (buscar) cuando exista
            }}
          >
            <Ionicons name="search-outline" size={16} color={colores.textoClaro} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.botonAccion}
            onPress={() => router.push("/Pestanas/Analisis/Calendario" as any)}
          >
            <Ionicons name="calendar-outline" size={16} color={colores.textoClaro} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.totales}>
        <TotalAnalisis
          etiqueta="Ingreso"
          valor={formatearMoneda(totalIngresos)}
          colorIcono={colores.acento}
          colorValor={colores.textoPrincipal}
        />
        <TotalAnalisis
          etiqueta="Gastos"
          valor={formatearMoneda(totalGastos)}
          colorIcono={colores.azul}
          colorValor={colores.azul}
          girarIcono
        />
      </View>

      <MisObjetivos />
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  // ---- Encabezado (igual que el de Inicio) ----
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

  // ---- Contenido ----
  selector: {
    marginBottom: espaciado.md,
  },
  tarjetaVacia: {
    backgroundColor: colores.gris,
    borderRadius: radios.tarjeta,
    padding: espaciado.lg,
    alignItems: "center",
    gap: espaciado.xs,
  },
  tituloVacio: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: colores.textoPrincipal,
  },
  textoVacio: {
    ...tipografia.pequeno,
    color: colores.textoPrincipal,
    textAlign: "center",
  },
  acciones: {
    position: "absolute",
    top: 10,
    right: 12,
    flexDirection: "row",
    gap: 6,
  },
  botonAccion: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colores.acento,
    alignItems: "center",
    justifyContent: "center",
  },
  totales: {
    flexDirection: "row",
    marginTop: espaciado.lg,
  },
  totalColumna: {
    flex: 1,
    alignItems: "center",
  },
  etiquetaTotal: {
    ...tipografia.pequeno,
    color: colores.textoPrincipal,
  },
  valorTotal: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    lineHeight: 22,
  },
});