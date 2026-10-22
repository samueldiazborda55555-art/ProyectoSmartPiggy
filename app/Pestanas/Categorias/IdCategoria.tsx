import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ICONOS } from '../../../src/components/finanzas/FichaCategoria';
import { CATEGORIAS } from '../../../src/constants/categorias';
import { colores } from '../../../src/constants/colores';
import { MOVIMIENTOS } from '../../../src/datos-falsos-backend/movimientos';
import { CategoriaId } from '../../../src/tipos/categoria';
import { Movimiento } from '../../../src/tipos/movimiento';

const MORADO = '#5b2a86';
const AZUL = '#0066FF';
const AZUL_CLARO = '#7CB9FF';

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

function agruparPorMes(lista: Movimiento[]) {
  const grupos: Record<string, Movimiento[]> = {};
  lista.forEach((m) => {
    const mes = MESES[new Date(m.fecha).getMonth()];
    if (!grupos[mes]) grupos[mes] = [];
    grupos[mes].push(m);
  });
  return Object.entries(grupos);
}

export default function DetalleCategoria() {
  const router = useRouter();
  const { idCategoria } = useLocalSearchParams<{ idCategoria?: string }>();

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
            <Pressable style={styles.ladoIzquierdo} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={colores.textoClaro} />
            </Pressable>
            <Text style={styles.titulo}>{categoria?.nombre ?? 'Categoría'}</Text>
            <View style={styles.ladoDerecho}>
              <View style={styles.campana}>
                <Ionicons name="notifications-outline" size={16} color={colores.fondoOscuro} />
              </View>
            </View>
          </View>

          <View style={styles.resumen}>
            <View style={styles.bloque}>
              <Text style={styles.etiqueta}>Saldo Total</Text>
              <Text style={styles.saldo}>$7,783.00</Text>
            </View>
            <View style={styles.divisor} />
            <View style={styles.bloque}>
              <Text style={styles.etiqueta}>Gasto Total</Text>
              <Text style={[styles.saldo, { color: AZUL }]}>-$1,187.40</Text>
            </View>
          </View>

          <View style={styles.barra}>
            <View style={styles.barraRelleno}>
              <Text style={styles.barraTexto}>30%</Text>
            </View>
          </View>
          <Text style={styles.mensaje}>El 30% De Tus Gastos, Suena Bien.</Text>
        </View>

        <ScrollView style={styles.hoja} contentContainerStyle={styles.contenido}>
          {grupos.length === 0 && (
            <Text style={styles.vacio}>No hay movimientos en esta categoría.</Text>
          )}

          {grupos.map(([mes, lista]) => (
            <View key={mes} style={styles.grupo}>
              <Text style={styles.mes}>{mes}</Text>
              {lista.map((m) => (
                <View key={m.id} style={styles.fila}>
                  <View style={styles.iconoCaja}>
                    <MaterialCommunityIcons
                      name={ICONOS[m.categoriaId]}
                      size={24}
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
            onPress={() => router.push('/Pestanas/Categorias/Agregar-gasto' as any)}
          >
            <Text style={styles.textoBoton}>Agregar Gastos</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: colores.fondoOscuro, alignItems: 'center' },
  pantalla: { flex: 1, width: '100%', maxWidth: 430 },
  encabezado: { paddingTop: 48, paddingHorizontal: 24, paddingBottom: 28, gap: 14 },
  barraTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ladoIzquierdo: { width: 32 },
  ladoDerecho: { width: 32, alignItems: 'flex-end' },
  titulo: { color: colores.textoClaro, fontSize: 18, fontWeight: '600' },
  campana: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colores.exito, alignItems: 'center', justifyContent: 'center',
  },
  resumen: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  bloque: { gap: 2 },
  etiqueta: { color: colores.textoClaro, fontSize: 10 },
  saldo: { color: colores.textoClaro, fontSize: 22, fontWeight: '700' },
  divisor: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.6)' },
  barra: { height: 22, borderRadius: 11, backgroundColor: '#ffffff', overflow: 'hidden' },
  barraRelleno: {
    width: '30%', height: '100%', backgroundColor: MORADO,
    alignItems: 'center', justifyContent: 'center',
  },
  barraTexto: { color: colores.textoClaro, fontSize: 10 },
  mensaje: { color: colores.textoClaro, fontSize: 11 },
  hoja: {
    flex: 1, backgroundColor: colores.hojaClara,
    borderTopLeftRadius: 60, borderTopRightRadius: 60,
  },
  contenido: { padding: 24, paddingTop: 32, gap: 16 },
  vacio: { textAlign: 'center', color: colores.textoSecundario },
  grupo: { gap: 12 },
  mes: { fontSize: 14, fontWeight: '600', color: colores.textoPrincipal },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconoCaja: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: AZUL_CLARO, alignItems: 'center', justifyContent: 'center',
  },
  datos: { flex: 1 },
  nombre: { fontSize: 14, fontWeight: '600', color: colores.textoPrincipal },
  fecha: { fontSize: 11, color: AZUL },
  monto: { fontSize: 14, fontWeight: '600', color: AZUL },
  boton: {
    marginTop: 12, alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 32,
    borderRadius: 24, backgroundColor: colores.exito,
  },
  textoBoton: { color: colores.textoPrincipal, fontWeight: '600' },
});