import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentProps, useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import ProgresoCircular from '../../../../src/components/finanzas/ProgresoCircular';
import { colores } from '../../../../src/constants/colores';
import { METAS } from '../../../../src/datos-falsos-backend/metas';
import { Aporte } from '../../../../src/tipos/meta';

type NombreIcono = ComponentProps<typeof MaterialCommunityIcons>['name'];

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function dinero(n: number) {
  return `$${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Ordena del más reciente al más antiguo y agrupa por mes
function agruparPorMes(aportes: Aporte[]) {
  const ordenados = [...aportes].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
  const grupos: Record<string, Aporte[]> = {};
  ordenados.forEach((a) => {
    const mes = MESES[new Date(a.fecha).getMonth()];
    if (!grupos[mes]) grupos[mes] = [];
    grupos[mes].push(a);
  });
  return Object.entries(grupos);
}

function formatearFecha(fecha: string) {
  const d = new Date(fecha);
  const hora = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${hora}:${min} - ${MESES[d.getMonth()]} ${d.getDate()}`;
}

export default function DetalleMeta() {
  const router = useRouter();

  // Al volver a esta pantalla se vuelve a dibujar, para ver los aportes nuevos
  const [, refrescar] = useState(0);
  useFocusEffect(
    useCallback(() => {
      refrescar((n) => n + 1);
    }, [])
  );

  const { idMeta } = useLocalSearchParams<{ idMeta?: string }>();

  // Si no llega ningún id (solo pasa al probar a mano), se muestra Viaje
  const meta = METAS.find((m) => m.id === (idMeta ?? 'viaje'));

  if (!meta) {
    return (
      <View style={styles.fondo}>
        <Text style={styles.vacio}>No se encontró esta meta.</Text>
      </View>
    );
  }

  const porcentaje = Math.min(100, (meta.montoAhorrado / meta.montoObjetivo) * 100);
  // Si es menos de 1 % se muestra con un decimal (por ejemplo 0.1%)
  const textoPorcentaje =
    porcentaje > 0 && porcentaje < 1
      ? porcentaje.toFixed(1)
      : String(Math.round(porcentaje));

  return (
    <View style={styles.fondo}>
      <View style={styles.pantalla}>
        <View style={styles.encabezado}>
          <Pressable style={styles.lado} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colores.textoPrincipal} />
          </Pressable>
          <Text style={styles.titulo}>{meta.nombre}</Text>
          <View style={[styles.lado, { alignItems: 'flex-end' }]}>
            <View style={styles.campana}>
              <Ionicons name="notifications-outline" size={16} color={colores.acento} />
            </View>
          </View>
        </View>

        <ScrollView style={styles.hoja} contentContainerStyle={styles.contenido}>
          <View style={styles.resumen}>
            <View style={styles.textos}>
              <View style={styles.etiquetaFila}>
                <Ionicons name="wallet-outline" size={12} color={colores.textoEtiqueta} />
                <Text style={styles.etiqueta}>Meta</Text>
              </View>
              <Text style={styles.monto}>{dinero(meta.montoObjetivo)}</Text>

              <View style={[styles.etiquetaFila, { marginTop: 14 }]}>
                <Ionicons name="wallet-outline" size={12} color={colores.textoEtiqueta} />
                <Text style={styles.etiqueta}>Cantidad Ahorrada</Text>
              </View>
              <Text style={[styles.monto, { color: colores.acento }]}>
                {dinero(meta.montoAhorrado)}
              </Text>
            </View>

            <View style={styles.cuadro}>
              <ProgresoCircular
                porcentaje={porcentaje}
                tamano={96}
                grosor={4}
                colorArco={colores.azul}
                colorFondo={colores.textoClaro}
              >
                <MaterialCommunityIcons
                  name={meta.icono as NombreIcono}
                  size={40}
                  color={colores.textoClaro}
                />
              </ProgresoCircular>
              <Text style={styles.nombreCuadro}>{meta.nombre}</Text>
            </View>
          </View>

          <View style={styles.barra}>
            <View style={[styles.barraRelleno, { width: `${porcentaje}%` }]} />
            <Text style={styles.barraTexto}>{textoPorcentaje}%</Text>
            <Text style={styles.barraTexto}>{dinero(meta.montoObjetivo)}</Text>
          </View>

          <View style={styles.mensajeFila}>
            <Ionicons name="checkbox-outline" size={14} color={colores.textoPrincipal} />
            <Text style={styles.mensaje}>El 30% De Tus Gastos, Suena Bien.</Text>
          </View>

          {agruparPorMes(meta.aportes).map(([mes, lista]) => (
            <View key={mes} style={styles.grupo}>
              <View style={styles.mesFila}>
                <Text style={styles.mes}>{mes}</Text>
                <View style={styles.calendario}>
                  <Ionicons name="calendar-outline" size={14} color={colores.textoClaro} />
                </View>
              </View>
              {lista.map((a, i) => (
                <View key={a.id} style={styles.fila}>
                  <View
                    style={[
                      styles.iconoCaja,
                      { backgroundColor: i % 2 === 0 ? colores.azulClaro : colores.azul },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={meta.icono as NombreIcono}
                      size={22}
                      color={colores.textoClaro}
                    />
                  </View>
                  <View style={styles.datos}>
                    <Text style={styles.nombreAporte}>Ahorro {meta.nombre}</Text>
                    <Text style={styles.fecha}>{formatearFecha(a.fecha)}</Text>
                  </View>
                  <Text style={styles.montoAporte}>{dinero(a.monto)}</Text>
                </View>
              ))}
            </View>
          ))}

          <Pressable
            style={styles.botonAgregar}
            onPress={() =>
              router.push(`/Pestanas/Categorias/Ahorros/Agregar-ahorro?idMeta=${meta.id}` as any)
            }
          >
            <Text style={styles.textoBotonAgregar}>Agregar Ahorros</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: colores.fondo, alignItems: 'center' },
  pantalla: { flex: 1, width: '100%', maxWidth: 430 },
  encabezado: {
    paddingTop: 48, paddingHorizontal: 24, paddingBottom: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  lado: { width: 32 },
  titulo: { fontSize: 16, fontWeight: '600', color: colores.textoPrincipal },
  campana: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colores.mentaClara, alignItems: 'center', justifyContent: 'center',
  },
  hoja: {
    flex: 1, backgroundColor: colores.hojaClara,
    borderTopLeftRadius: 44, borderTopRightRadius: 44,
  },
  contenido: { padding: 24, paddingTop: 32, gap: 20 },
  resumen: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textos: { flex: 1 },
  etiquetaFila: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  etiqueta: { fontSize: 11, color: colores.textoEtiqueta },
  monto: { fontSize: 22, fontWeight: '700', color: colores.textoPrincipal },
  cuadro: {
    width: 150, height: 150, borderRadius: 32, backgroundColor: colores.azulClaro,
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  nombreCuadro: {
    fontSize: 11, color: colores.textoClaro, fontWeight: '600', textAlign: 'center',
  },
  barra: {
    height: 20, borderRadius: 10, backgroundColor: colores.acento,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 10, overflow: 'hidden',
  },
  barraRelleno: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    backgroundColor: colores.textoEtiqueta,
  },
  barraTexto: { fontSize: 9, color: colores.textoClaro, fontWeight: '600' },
  mensajeFila: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mensaje: { fontSize: 11, color: colores.textoPrincipal },
  grupo: { gap: 12 },
  mesFila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mes: { fontSize: 13, fontWeight: '600', color: colores.textoPrincipal },
  calendario: {
    width: 24, height: 24, borderRadius: 8,
    backgroundColor: colores.acento, alignItems: 'center', justifyContent: 'center',
  },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconoCaja: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  datos: { flex: 1 },
  nombreAporte: { fontSize: 13, fontWeight: '600', color: colores.textoPrincipal },
  fecha: { fontSize: 10, color: colores.azul },
  montoAporte: { fontSize: 13, fontWeight: '600', color: colores.textoPrincipal },
  botonAgregar: {
    alignSelf: 'center', marginTop: 8, paddingVertical: 10, paddingHorizontal: 28,
    borderRadius: 20, backgroundColor: colores.acento,
  },
  textoBotonAgregar: { color: colores.textoPrincipal, fontWeight: '600', fontSize: 12 },
  vacio: { marginTop: 80, color: colores.textoSecundario },
});