import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import FichaCategoria from '../../../src/components/finanzas/FichaCategoria';
import { CATEGORIAS } from '../../../src/constants/categorias';
import { colores } from '../../../src/constants/colores';

export default function PantallaCategorias() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState('');

  const cerrarModal = () => {
    setModalVisible(false);
    setNombreNuevo('');
  };

  return (
    <View style={styles.fondo}>
      <View style={styles.pantalla}>
        {/* TEMPORAL: reemplazar por ResumenSaldo y BarraProgresoPresupuesto */}
        <View style={styles.encabezado}>
          <View style={styles.barraTitulo}>
            <View style={styles.lado}>
              <Ionicons name="arrow-back" size={22} color={colores.textoPrincipal} />
            </View>
            <Text style={styles.titulo}>Categorías</Text>
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

        <ScrollView style={styles.hoja} contentContainerStyle={styles.cuadricula}>
          {CATEGORIAS.map((categoria) => (
            <View key={categoria.id} style={styles.celda}>
              <FichaCategoria
                categoria={categoria}
                seleccionada={categoria.id === 'comida'}
                alPresionar={
                  categoria.id === 'mas'
                    ? () => setModalVisible(true)
                    : categoria.id === 'ahorros'
                    ? () => router.push('/Pestanas/Categorias/Ahorros' as any)
                    : undefined
}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={cerrarModal}
      >
        <View style={styles.fondoModal}>
          <View style={styles.tarjetaModal}>
            <Text style={styles.tituloModal}>Nueva categoría</Text>
            <TextInput
              style={styles.campo}
              placeholder="Nombre de la categoría"
              placeholderTextColor={colores.textoSecundario}
              value={nombreNuevo}
              onChangeText={setNombreNuevo}
            />
            <View style={styles.botones}>
              <Pressable style={styles.botonCancelar} onPress={cerrarModal}>
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.botonGuardar} onPress={cerrarModal}>
                <Text style={styles.textoGuardar}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  cuadricula: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 36,
  },
  celda: { width: '33.33%', alignItems: 'center', marginBottom: 28 },
  fondoModal: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  tarjetaModal: {
    width: '100%', maxWidth: 360, backgroundColor: colores.fondoClaro,
    borderRadius: 20, padding: 24, gap: 16,
  },
  tituloModal: { fontSize: 18, color: colores.textoPrincipal, textAlign: 'center' },
  campo: {
    borderWidth: 1, borderColor: colores.borde, borderRadius: 12,
    padding: 12, fontSize: 14, color: colores.textoPrincipal,
  },
  botones: { flexDirection: 'row', gap: 12 },
  botonCancelar: {
    flex: 1, padding: 12, borderRadius: 24,
    backgroundColor: colores.mentaClara, alignItems: 'center',
  },
  textoCancelar: { color: colores.textoPrincipal },
  botonGuardar: {
    flex: 1, padding: 12, borderRadius: 24,
    backgroundColor: colores.menta, alignItems: 'center',
  },
  textoGuardar: { color: colores.textoClaro },
});