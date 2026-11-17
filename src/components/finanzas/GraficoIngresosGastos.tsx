import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import { colores } from "@/constants/colores";
import { espaciado, radios } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";

// Cada grupo de barras: una etiqueta (lu, semana 1, Ene...) y sus dos valores
export type DatoBarras = {
  etiqueta: string;
  ingresos: number;
  gastos: number;
};

type Props = {
  datos: DatoBarras[];
  titulo?: string;
};

const SECCIONES = 4;             // cuántas líneas guía horizontales hay
const ALTO_GRAFICO = 180;
const ANCHO_ETIQUETAS_Y = 36;    // espacio para los números del lado izquierdo
const ESPACIO_ENTRE_BARRAS = 3;  // separación entre la barra verde y la azul

// Redondea el máximo hacia arriba a un número "bonito" (1, 2, 5 x 10^n)
// para que las líneas guía caigan en valores limpios (1k, 2k, 3k, 4k...)
function topeEscala(maximo: number): number {
  if (maximo <= 0) return SECCIONES * 10;
  const paso = maximo / SECCIONES;
  const potencia = Math.pow(10, Math.floor(Math.log10(paso)));
  const normal = paso / potencia;
  const bonito = normal <= 1 ? 1 : normal <= 2 ? 2 : normal <= 5 ? 5 : 10;
  return bonito * potencia * SECCIONES;
}

// 2500 -> "2,5k"
function etiquetaY(valor: string): string {
  const n = Number(valor);
  if (n >= 1000) return `${String(n / 1000).replace(".", ",")}k`;
  return String(Math.round(n));
}

export default function GraficoIngresosGastos({ datos, titulo }: Props) {
  const [anchoTarjeta, setAnchoTarjeta] = useState(0);

  const alMedir = (e: LayoutChangeEvent) => setAnchoTarjeta(e.nativeEvent.layout.width);

  const hayDatos = datos.some((d) => d.ingresos > 0 || d.gastos > 0);

  // ---- Medidas: todo se calcula para que las barras quepan sin scroll ----
  const n = datos.length;
  const anchoGrafico = Math.max(0, anchoTarjeta - espaciado.md * 2 - ANCHO_ETIQUETAS_Y);
  const anchoBarra = n > 0
    ? Math.max(5, Math.min(12, Math.floor((anchoGrafico / n) * 0.2)))
    : 8;
  const anchoPar = anchoBarra * 2 + ESPACIO_ENTRE_BARRAS;
  const hueco = n > 0 ? Math.max(4, (anchoGrafico - n * anchoPar) / (n + 1)) : 0;

  const tope = topeEscala(Math.max(0, ...datos.flatMap((d) => [d.ingresos, d.gastos])));

  // La librería recibe una lista plana: por cada dato van dos barras seguidas.
  // La etiqueta se pone en la primera barra de cada pareja.
  // La caja de la etiqueta mide "pareja + hueco" y empieza en la primera barra,
  // por eso corremos el texto medio hueco a la izquierda: así queda justo
  // en el centro de las dos barras.
  const barras = datos.flatMap((d) => [
    {
      value: d.ingresos,
      frontColor: colores.acento,
      spacing: ESPACIO_ENTRE_BARRAS,
      label: d.etiqueta,
      labelWidth: anchoPar + hueco,
      labelTextStyle: [styles.etiquetaX, { transform: [{ translateX: -hueco / 2 }] }],
    },
    {
      value: d.gastos,
      frontColor: colores.azul,
    },
  ]);

  return (
    <View style={styles.tarjeta} onLayout={alMedir}>
      {!!titulo && <Text style={styles.titulo}>{titulo}</Text>}

      {!hayDatos ? (
        <Text style={styles.vacio}>Sin datos para mostrar</Text>
      ) : (
        anchoGrafico > 0 && (
          <BarChart
            data={barras}
            width={anchoGrafico}
            height={ALTO_GRAFICO}
            barWidth={anchoBarra}
            spacing={hueco}
            initialSpacing={hueco / 2}
            endSpacing={0}
            maxValue={tope}
            noOfSections={SECCIONES}
            roundedTop
            disableScroll
            disablePress
            isAnimated={false}
            // líneas guía
            rulesColor={colores.textoSecundario}
            rulesType="solid"
            // ejes
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisLabelWidth={ANCHO_ETIQUETAS_Y}
            yAxisTextStyle={styles.etiquetaY}
            formatYLabel={etiquetaY}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.gris,
    borderRadius: radios.tarjeta,
    padding: espaciado.md,
    minHeight: 120,
    justifyContent: "center",
  },
  titulo: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: colores.textoPrincipal,
    marginBottom: espaciado.sm,
  },
  etiquetaX: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: colores.textoPrincipal,
    textAlign: "center",
  },
  etiquetaY: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: colores.textoPrincipal,
  },
  vacio: {
    ...tipografia.texto,
    color: colores.textoSecundario,
    textAlign: "center",
  },
});