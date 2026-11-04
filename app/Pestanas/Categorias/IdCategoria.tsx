import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ICONOS } from '../../../src/components/finanzas/FichaCategoria';
import { CATEGORIAS } from '../../../src/constants/categorias';
import { colores } from '../../../src/constants/colores';
import { MOVIMIENTOS } from '../../../src/datos-falsos-backend/movimientos';
import { CategoriaId } from '../../../src/tipos/categoria';
import { Movimiento } from '../../../src/tipos/movimiento';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function formatearFecha(fecha: string) {
  const d = new Date(fecha);
  const hora = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${hora}:${min} - ${MESES[d.getMonth()]} ${d.getDate()}`;
}

function formatearMonto(monto: number) {
  return `-$${monto.toFixed(2).replace('.', ',')}`;
}

// Ordena del más reciente al más antiguo y agrupa por mes
function agruparPorMes(lista: Movimiento[]) {
  const ordenados = [...lista].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
  const grupos: Record<string, Movimiento[]> = {};
  ordenados.forEach((m) => {
    const mes = MESES[new Date(m.fecha).getMonth()];
    if (!grupos[mes]) grupos[mes] = [];
    grupos[mes].push(m);
  });
  return Object.entries(grupos);
}

export default function DetalleCategoria() {
  const router = useRouter();
  const { idCategoria } = useLocalSearchParams<{ idCategoria?: string }>();

  // Al volver a esta pantalla se vuelve a dibujar, para ver los gastos nuevos
  const [, refrescar] = useState(0);
  useFocusEffect(
    useCallback(() => {
      refrescar((n) => n + 1);
    }, [])
  );

  // Si no llega ningún id (solo pasa en la prueba), se muestra Comida
  const id = (idCategoria ?? 'comida') as CategoriaId;
  const categoria = CATEGORIAS.find((c) => c.id === id);

  const movimientos = MOVIMIENTOS.filter((m) => m.categoriaId === id);
  const grupos = agruparPorMes(movimientos);

  return (
    <View style={styles.fondo}>
      <View style={styles.pantalla}>
        {/* TEMPORAL: reemplazar por ResumenSaldo y BarraProgresoPresupuesto */}
        <View style={styles.encabezado}>
          <View style={styles.barraTitulo}>
            <Pressable style={styles.lado} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={colores.textoPrincipal} />
            </Pressable>
            <Text style={styles.titulo}>{categoria?.nombre ?? 'Categoría'}</Text>
            <View style={[styles.lado, { alignItems: 'flex-end' }]}>
              <View style={styles.campana}>
                <Ionicons name="notifications-outline" size={16} color={colores.acento} />
              </View>
            </View>
          </View>

          <View style={styles.resumen}>
            <View>
              <Text style={styles.etiqueta}>Saldo Total</Text>
              <Text style={styles.saldo}>$7,783.00</Text>
            </View>
            <View style={styles.divisor} />
            <View>
              <Text style={styles.etiqueta}>Gasto Total</Text>
              <Text style={[styles.saldo, { color: colores.acento }]}>-$1,187.40</Text>
            </View>
          </View>

          <View style={styles.barra}>
            <View style={styles.barraRelleno}>
              <Text style={styles.barraTexto}>30%</Text>
            </View>
            <Text style={styles.barraMonto}>$20,000.00</Text>
          </View>
          <Text style={styles.mensaje}>El 30% De Tus Gastos, Se Ven Bien.</Text>
        </View>

        <ScrollView style={styles.hoja} contentContainerStyle={styles.contenido}>
          {grupos.length === 0 && (
            <Text style={styles.vacio}>No hay movimientos en esta categoría.</Text>
          )}

          {grupos.map(([mes, lista]) => (
            <View key={mes} style={styles.grupo}>
              <View style={styles.mesFila}>
                <Text style={styles.mes}>{mes}</Text>
                <View style={styles.calendario}>
                  <Ionicons name="calendar-outline" size={14} color={colores.textoClaro} />
                </View>
              </View>
              {lista.map((m, i) => (
                <View key={m.id} style={styles.fila}>
                  <View
                    style={[
                      styles.iconoCaja,
                      { backgroundColor: i % 2 === 0 ? colores.azulClaro : colores.azul },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={ICONOS[m.categoriaId]}
                      size={22}
                      color={colores.textoClaro}
                    />
                  </View>
                  <View style={styles.datos}>
                    <Text style={styles.nombre}>{m.nombre}</Text>
                    <Text style={styles.fecha}>{formatearFecha(m.fecha)}</Text>
                  </View>
                  <Text style={styles.monto}>{formatearMonto(m.monto)}</Text>
                </View>
              ))}
            </View>
          ))}

          <Pressable
            style={styles.boton}
            onPress={() =>
              router.push(`/Pestanas/Categorias/Agregar-gasto?idCategoria=${id}` as any)
            }
          >
            <Text style={styles.textoBoton}>Agregar Gastos</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: colores.fondo, alignItems: 'center' },
  pantalla: { flex: 1, width: '100%', maxWidth: 430 },
  encabezado: { paddingTop: 48, paddingHorizontal: 24, paddingBottom: 24, gap: 12 },
  barraTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lado: { width: 32 },
  titulo: { fontSize: 16, fontWeight: '600', color: colores.textoPrincipal },
  campana: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colores.mentaClara, alignItems: 'center', justifyContent: 'center',
  },
  resumen: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 },
  etiqueta: { fontSize: 10, color: colores.textoEtiqueta },
  saldo: { fontSize: 20, fontWeight: '700', color: colores.textoPrincipal },
  divisor: { width: 1, height: 36, backgroundColor: colores.borde },
  barra: {
    height: 20, borderRadius: 10, backgroundColor: colores.verdeProgreso,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    overflow: 'hidden',
  },
  barraRelleno: {
    width: '30%', height: '100%', backgroundColor: colores.acento,
    alignItems: 'center', justifyContent: 'center',
  },
  barraTexto: { fontSize: 9, color: colores.textoClaro, fontWeight: '600' },
  barraMonto: { fontSize: 9, color: colores.textoPrincipal, paddingRight: 10 },
  mensaje: { fontSize: 11, color: colores.textoPrincipal, textAlign: 'center' },
  hoja: {
    flex: 1, backgroundColor: colores.hojaClara,
    borderTopLeftRadius: 44, borderTopRightRadius: 44,
  },
  contenido: { padding: 24, paddingTop: 28, gap: 16 },
  vacio: { textAlign: 'center', color: colores.textoSecundario },
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
  nombre: { fontSize: 13, fontWeight: '600', color: colores.textoPrincipal },
  fecha: { fontSize: 10, color: colores.azul },
  monto: { fontSize: 13, fontWeight: '600', color: colores.azul },
  boton: {
    marginTop: 8, alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 32,
    borderRadius: 20, backgroundColor: colores.acento,
  },
  textoBoton: { color: colores.textoPrincipal, fontWeight: '600', fontSize: 12 },
});