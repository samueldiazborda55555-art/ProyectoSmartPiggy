import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import ProgresoCircular from '../../../../src/components/finanzas/ProgresoCircular';
import { colores } from '../../../../src/constants/colores';
import { METAS } from '../../../../src/datos-falsos-backend/metas';
import { Aporte } from '../../../../src/tipos/meta';

type NombreIcono = ComponentProps<typeof MaterialCommunityIcons>['name'];

// Colores del Figma (todavía no están en colores.ts)
const VERDE = '#0e8a4b';
const VERDE_OSCURO = '#12403a';
const AZUL_CLARO = '#7CB9FF';
const GRIS_HOJA = '#e9eff2';

function dinero(n: number) {
  return `$${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

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

  const porcentaje = (meta.montoAhorrado / meta.montoObjetivo) * 100;

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
              <Ionicons name="notifications-outline" size={16} color={VERDE} />
            </View>
          </View>
        </View>

        <ScrollView style={styles.hoja} contentContainerStyle={styles.contenido}>
          <View style={styles.resumen}>
            <View style={styles.textos}>
              <Text style={styles.etiqueta}>Meta</Text>
              <Text style={styles.monto}>{dinero(meta.montoObjetivo)}</Text>
              <Text style={[styles.etiqueta, { marginTop: 14 }]}>Cantidad Ahorrada</Text>
              <Text style={[styles.monto, { color: VERDE }]}>
                {dinero(meta.montoAhorrado)}
              </Text>
            </View>

            <View style={styles.cuadro}>
              <ProgresoCircular porcentaje={porcentaje} tamano={112} grosor={6} colorArco="#0066FF" colorFondo="#ffffff">
                <MaterialCommunityIcons
                  name={meta.icono as NombreIcono}
                  size={46}
                  color="#ffffff"
                />
              </ProgresoCircular>
              <Text style={styles.nombreCuadro}>{meta.nombre}</Text>
            </View>
          </View>

          <View style={styles.barra}>
            <View style={[styles.barraRelleno, { width: `${Math.max(porcentaje, 12)}%` }]}>
              <Text style={styles.barraTexto}>{Math.round(porcentaje)}%</Text>
            </View>
            <Text style={styles.barraMonto}>{dinero(meta.montoObjetivo)}</Text>
          </View>

          {agruparPorMes(meta.aportes).map(([mes, lista]) => (
  <View key={mes} style={styles.grupo}>
    <View style={styles.mesFila}>
      <Text style={styles.mes}>{mes}</Text>
      <View style={styles.calendario}>
        <Ionicons name="calendar-outline" size={14} color={VERDE} />
      </View>
    </View>
    {lista.map((a) => (
      <View key={a.id} style={styles.fila}>
        <View style={styles.iconoCaja}>
          <MaterialCommunityIcons
            name={meta.icono as NombreIcono}
            size={22}
            color="#ffffff"
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
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: '#ffffff', alignItems: 'center' },
  pantalla: { flex: 1, width: '100%', maxWidth: 430 },
  encabezado: {
    paddingTop: 48, paddingHorizontal: 24, paddingBottom: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  lado: { width: 32 },
  titulo: { fontSize: 16, fontWeight: '600', color: colores.textoPrincipal },
  campana: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#dcefe3', alignItems: 'center', justifyContent: 'center',
  },
  hoja: {
    flex: 1, backgroundColor: GRIS_HOJA,
    borderTopLeftRadius: 44, borderTopRightRadius: 44,
  },
  contenido: { padding: 24, paddingTop: 32, gap: 24 },
  resumen: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textos: { flex: 1 },
  etiqueta: { fontSize: 11, color: colores.textoSecundario },
  monto: { fontSize: 22, fontWeight: '700', color: colores.textoPrincipal },
  cuadro: {
    width: 150, height: 150, borderRadius: 32, backgroundColor: AZUL_CLARO,
    alignItems: 'center', justifyContent: 'center',
  },
  nombreCuadro: { position: 'absolute', bottom: 10, fontSize: 11, color: '#ffffff', fontWeight: '600' },
  barra: {
    height: 20, borderRadius: 10, backgroundColor: VERDE,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    overflow: 'hidden',
  },
  barraRelleno: {
    height: '100%', backgroundColor: VERDE_OSCURO,
    alignItems: 'center', justifyContent: 'center',
  },
  barraTexto: { fontSize: 9, color: '#ffffff', fontWeight: '600' },
  barraMonto: { fontSize: 9, color: '#ffffff', paddingRight: 10 },
  vacio: { marginTop: 80, color: colores.textoSecundario },

    grupo: { gap: 12 },
  mesFila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mes: { fontSize: 13, fontWeight: '600', color: colores.textoPrincipal },
  calendario: {
    width: 24, height: 24, borderRadius: 8,
    backgroundColor: '#dcefe3', alignItems: 'center', justifyContent: 'center',
  },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconoCaja: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: AZUL_CLARO,
    alignItems: 'center', justifyContent: 'center',
  },
  datos: { flex: 1 },
  nombreAporte: { fontSize: 13, fontWeight: '600', color: colores.textoPrincipal },
  fecha: { fontSize: 10, color: '#0066FF' },
  montoAporte: { fontSize: 13, fontWeight: '600', color: colores.textoPrincipal },
});