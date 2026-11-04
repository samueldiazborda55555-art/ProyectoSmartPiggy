import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import FormularioMovimiento, {
    DatosFormulario,
} from '../../../../src/components/finanzas/FormularioMovimiento';
import { colores } from '../../../../src/constants/colores';
import { METAS } from '../../../../src/datos-falsos-backend/metas';

// Colores del Figma (todavía no están en colores.ts)
const VERDE = '#0e8a4b';
const GRIS_HOJA = '#e9eff2';

export default function AgregarAhorro() {
  const router = useRouter();
  const { idMeta } = useLocalSearchParams<{ idMeta?: string }>();

  const guardar = (datos: DatosFormulario) => {
    const meta = METAS.find((m) => m.id === (datos.opcionId ?? idMeta));

    if (meta) {
      const fecha = new Date(datos.fecha);

      // Se suma a la lista de datos falsos (no queda guardado al cerrar la app)
      meta.aportes.push({
        id: `a${Date.now()}`,
        fecha: (isNaN(fecha.getTime()) ? new Date() : fecha).toISOString(),
        monto: datos.monto,
      });
      meta.montoAhorrado += datos.monto;
    }

    router.back();
  };

  return (
    <View style={styles.fondo}>
      <View style={styles.pantalla}>
        <View style={styles.encabezado}>
          <Pressable style={styles.lado} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colores.textoPrincipal} />
          </Pressable>
          <Text style={styles.titulo}>Agregar Ahorros</Text>
          <View style={[styles.lado, { alignItems: 'flex-end' }]}>
            <View style={styles.campana}>
              <Ionicons name="notifications-outline" size={16} color={VERDE} />
            </View>
          </View>
        </View>

        <ScrollView style={styles.hoja} contentContainerStyle={styles.contenido}>
          <FormularioMovimiento
            opciones={METAS.map((m) => ({ id: m.id, nombre: m.nombre }))}
            textoOpcion="Selecciona la meta"
            opcionInicial={idMeta}
            onGuardar={guardar}
          />
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
  contenido: { padding: 24, paddingTop: 32 },
});