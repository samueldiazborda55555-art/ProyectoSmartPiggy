import { StyleSheet, Text, View } from "react-native";
import Svg, { Path, Text as TextoSvg } from "react-native-svg";

import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";
import type { Movimiento } from "@/tipos/movimiento";
import { calcularGastosPorCategoria } from "@/utilidades/gastosPorCategoria";

type Props = {
  movimientos: Movimiento[];
  fecha?: Date; // mes que se muestra (por defecto, el mes actual)
};

// Azules del diseño: la porción más grande, la mediana y la pequeña
const PALETA = [colores.azulMedio, colores.azulClaro, colores.azul, colores.secundario];

const RADIO = 110;
const MARGEN = 2;
const PORCENTAJE_MINIMO_TEXTO = 5; // por debajo de esto la porción es muy delgada para el texto

export default function GraficoCircularCategorias({ movimientos, fecha }: Props) {
  const porciones = calcularGastosPorCategoria(movimientos, fecha);

  if (porciones.length === 0) {
    return <Text style={styles.vacio}>No hay gastos en este mes</Text>;
  }

  const ancho = RADIO * 2 + MARGEN * 2;
  const alto = RADIO + MARGEN * 2;
  const cx = RADIO + MARGEN;
  const cy = RADIO + MARGEN;

  // Cada porción conserva su color según su tamaño; se dibujan de la más
  // pequeña (izquierda) a la más grande (derecha), como en el Figma.
  const aDibujar = porciones
    .map((p, i) => ({ ...p, color: PALETA[i % PALETA.length] }))
    .reverse();

  let acumulado = 0;
  const rebanadas = aDibujar.map((p) => {
    // El semicírculo va de 180° (izquierda) a 360° (derecha), pasando por arriba
    const a0 = Math.PI + (acumulado / 100) * Math.PI;
    const a1 = Math.PI + ((acumulado + p.porcentaje) / 100) * Math.PI;
    acumulado += p.porcentaje;

    const x0 = cx + RADIO * Math.cos(a0);
    const y0 = cy + RADIO * Math.sin(a0);
    const x1 = cx + RADIO * Math.cos(a1);
    const y1 = cy + RADIO * Math.sin(a1);

    const medio = (a0 + a1) / 2;
    return {
      ...p,
      d: `M ${cx} ${cy} L ${x0} ${y0} A ${RADIO} ${RADIO} 0 0 1 ${x1} ${y1} Z`,
      tx: cx + RADIO * 0.62 * Math.cos(medio),
      ty: cy + RADIO * 0.62 * Math.sin(medio),
    };
  });

  return (
    <View style={styles.contenedor}>
      <Svg width={ancho} height={alto}>
        {rebanadas.map((r) => (
          <Path key={r.categoriaId} d={r.d} fill={r.color} stroke={colores.hojaClara} strokeWidth={2} />
        ))}
        {rebanadas.map(
          (r) =>
            r.porcentaje >= PORCENTAJE_MINIMO_TEXTO && (
              <TextoSvg
                key={`t-${r.categoriaId}`}
                x={r.tx}
                y={r.ty + 5}
                fill={colores.textoClaro}
                fontSize={14}
                fontFamily="Poppins_600SemiBold"
                textAnchor="middle"
              >
                {`${r.porcentaje}%`}
              </TextoSvg>
            )
        )}
      </Svg>

      {/* Leyenda */}
      <View style={styles.leyenda}>
        {porciones.map((p, i) => (
          <View key={p.categoriaId} style={styles.itemLeyenda}>
            <View style={[styles.punto, { backgroundColor: PALETA[i % PALETA.length] }]} />
            <Text style={styles.textoLeyenda}>{p.nombre}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: "center",
    gap: espaciado.md,
  },
  leyenda: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: espaciado.md,
  },
  itemLeyenda: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.xs + 2,
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  textoLeyenda: {
    ...tipografia.pequeno,
    color: colores.textoPrincipal,
  },
  vacio: {
    ...tipografia.texto,
    color: colores.textoSecundario,
    textAlign: "center",
    marginTop: espaciado.lg,
  },
});