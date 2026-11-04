import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import TarjetaMeta from '../../../../src/components/finanzas/TarjetaMeta';
import { colores } from '../../../../src/constants/colores';
import { METAS } from '../../../../src/datos-falsos-backend/metas';

// Colores del Figma (todavía no están en colores.ts)
const VERDE = '#0e8a4b';
const VERDE_CLARO = '#cfe6d6';
const GRIS_HOJA = '#e9eff2';

export default function PantallaAhorros() {
  const router = useRouter();

  return (
    <View style={styles.fondo}>
      <View style={styles.pantalla}>
        {/* TEMPORAL: reemplazar por ResumenSaldo y BarraProgresoPresupuesto */}
        <View style={styles.encabezado}>
          <View style={styles.barraTitulo}>
            <Pressable style={styles.lado} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={colores.textoPrincipal} />
            </Pressable>
            <Text style={styles.titulo}>Ahorros</Text>
            <View style={[styles.lado, { alignItems: 'flex-end' }]}>
              <View style={styles.campana}>
                <Ionicons name="notifications-outline" size={16} color={VERDE} />
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
              <Text style={[styles.saldo, { color: VERDE }]}>-$1,187.40</Text>
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
          <View style={styles.cuadricula}>
            {METAS.map((meta, i) => (
              <View key={meta.id} style={styles.celda}>
                <TarjetaMeta
                  meta={meta}
                  seleccionada={i === 0}
                  alPresionar={() =>
                    router.push(
                      `/Pestanas/Categorias/Ahorros/idMeta?idMeta=${meta.id}` as any
                    )
                  }
                />
              </View>
            ))}
          </View>

          <Pressable
            style={styles.boton}
            onPress={() =>
              router.push('/Pestanas/Categorias/Ahorros/Agregar-ahorro' as any)
            }
          >
            <Text style={styles.textoBoton}>Agregar Ahorros</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: '#ffffff', alignItems: 'center' },
  pantalla: { flex: 1, width: '100%', maxWidth: 430 },
  encabezado: { paddingTop: 48, paddingHorizontal: 24, paddingBottom: 24, gap: 12 },
  barraTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lado: { width: 32 },
  titulo: { fontSize: 16, fontWeight: '600', color: colores.textoPrincipal },
  campana: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#dcefe3', alignItems: 'center', justifyContent: 'center',
  },
  resumen: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  etiqueta: { fontSize: 10, color: colores.textoSecundario },
  saldo: { fontSize: 20, fontWeight: '700', color: colores.textoPrincipal },
  divisor: { width: 1, height: 36, backgroundColor: colores.borde },
  barra: {
    height: 20, borderRadius: 10, backgroundColor: VERDE_CLARO,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    overflow: 'hidden',
  },
  barraRelleno: {
    width: '30%', height: '100%', backgroundColor: VERDE,
    alignItems: 'center', justifyContent: 'center',
  },
  barraTexto: { fontSize: 9, color: '#ffffff', fontWeight: '600' },
  barraMonto: { fontSize: 9, color: colores.textoPrincipal, paddingRight: 10 },
  mensaje: { fontSize: 11, color: colores.textoPrincipal, textAlign: 'center' },
  hoja: {
    flex: 1, backgroundColor: GRIS_HOJA,
    borderTopLeftRadius: 44, borderTopRightRadius: 44,
  },
  contenido: { padding: 24, paddingTop: 32, gap: 32, flexGrow: 1 },
  cuadricula: { flexDirection: 'row', flexWrap: 'wrap' },
  celda: { width: '33.33%', alignItems: 'center', marginBottom: 24 },
  boton: {
    alignSelf: 'center', marginTop: 'auto', paddingVertical: 10, paddingHorizontal: 28,
    borderRadius: 20, backgroundColor: VERDE,
  },
  textoBoton: { color: '#ffffff', fontWeight: '600', fontSize: 12 },
});