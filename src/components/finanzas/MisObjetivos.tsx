import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ProgresoCircular from "@/components/finanzas/ProgresoCircular";
import { colores } from "@/constants/colores";
import { espaciado, radios } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";
import { useMetas } from "@/hooks/useMetas";
import type { Meta } from "@/tipos/meta";

// Porcentaje de avance de una meta (0 a 100)
function porcentajeDe(meta: Meta): number {
  if (meta.montoObjetivo <= 0) return 0;
  return Math.min(100, Math.round((meta.montoAhorrado / meta.montoObjetivo) * 100));
}

export default function MisObjetivos() {
  const { metas } = useMetas();

  // Se muestran las 2 metas con más avance
  const destacadas = [...metas]
    .sort((a, b) => b.montoAhorrado / b.montoObjetivo - a.montoAhorrado / a.montoObjetivo)
    .slice(0, 2);

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Mis Objetivos</Text>

      {destacadas.length === 0 ? (
        <Text style={styles.vacio}>Aún no tienes metas de ahorro</Text>
      ) : (
        <View style={styles.fila}>
          {destacadas.map((meta) => (
            <TouchableOpacity
              key={meta.id}
              activeOpacity={0.8}
              style={styles.tarjeta}
              onPress={() => router.push(`/Pestanas/Analisis/Meta/${meta.id}` as any)}
            >
              <ProgresoCircular
                porcentaje={porcentajeDe(meta)}
                tamano={84}
                grosor={8}
                colorArco={colores.acento}
                colorFondo={colores.textoPrincipal}
              />
              <Text style={styles.nombre} numberOfLines={1}>
                {meta.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginTop: espaciado.lg,
  },
  titulo: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.textoPrincipal,
    marginBottom: espaciado.sm + 2,
  },
  fila: {
    flexDirection: "row",
    gap: espaciado.md,
  },
  tarjeta: {
    flex: 1,
    backgroundColor: colores.fondoClaro,
    borderRadius: radios.tarjeta,
    paddingVertical: espaciado.md,
    alignItems: "center",
    gap: espaciado.sm,
  },
  nombre: {
    ...tipografia.etiqueta,
    color: colores.textoPrincipal,
  },
  vacio: {
    ...tipografia.texto,
    color: colores.textoSecundario,
    textAlign: "center",
    marginTop: espaciado.sm,
  },
});