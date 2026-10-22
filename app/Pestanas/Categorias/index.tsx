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

import FichaCategoria from '../../../src/components/finanzas/FichaCategoria';
import { CATEGORIAS } from '../../../src/constants/categorias';
import { colores } from '../../../src/constants/colores';

// Colores del Figma que todavía no están en colores.ts
const MORADO = '#5b2a86';
const AZUL_GASTO = '#0066FF';

export default function PantallaCategorias() {
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
            <View style={styles.ladoIzquierdo}>
              <Ionicons name="arrow-back" size={22} color={colores.textoClaro} />
            </View>
            <Text style={styles.titulo}>Categorías</Text>
            <View style={styles.ladoDerecho}>
              <View style={styles.campana}>
                <Ionicons
                  name="notifications-outline"
                  size={16}
                  color={colores.fondoOscuro}
                />
              </View>
            </View>
          </View>

          <View style={styles.resumen}>
            <View style={styles.bloque}>
              <View style={styles.etiquetaFila}>
                <Ionicons name="wallet-outline" size={12} color={colores.textoClaro} />
                <Text style={styles.etiqueta}>Saldo Total</Text>
              </View>
              <Text style={styles.saldo}>$7,783.00</Text>
            </View>
            <View style={styles.divisor} />
            <View style={styles.bloque}>
              <View style={styles.etiquetaFila}>
                <Ionicons name="card-outline" size={12} color={colores.textoClaro} />
                <Text style={styles.etiqueta}>Gasto Total</Text>
              </View>
              <Text style={[styles.saldo, { color: AZUL_GASTO }]}>-$1,187.40</Text>
            </View>
          </View>

          <View style={styles.barra}>
            <View style={styles.barraRelleno}>
              <Text style={styles.barraTexto}>30%</Text>
            </View>
          </View>
          <View style={styles.mensajeFila}>
            <Ionicons name="checkbox-outline" size={14} color={colores.textoClaro} />
            <Text style={styles.mensaje}>El 30% De Tus Gastos, Suena Bien.</Text>
          </View>
        </View>

        <ScrollView style={styles.hoja} contentContainerStyle={styles.cuadricula}>
          {CATEGORIAS.map((categoria) => (
            <View key={categoria.id} style={styles.celda}>
              <FichaCategoria
                categoria={categoria}
                seleccionada={categoria.id === 'comida'}
                alPresionar={
                  categoria.id === 'mas' ? () => setModalVisible(true) : undefined
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
  fondo: {
    flex: 1,
    backgroundColor: colores.fondoOscuro,
    alignItems: 'center',
  },
  pantalla: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
  },
  encabezado: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 28,
    gap: 14,
  },
  barraTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ladoIzquierdo: { width: 32 },
  ladoDerecho: { width: 32, alignItems: 'flex-end' },
  titulo: {
    color: colores.textoClaro,
    fontSize: 18,
    fontWeight: '600',
  },
  campana: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colores.exito,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  bloque: { gap: 2 },
  etiquetaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  etiqueta: {
    color: colores.textoClaro,
    fontSize: 10,
  },
  saldo: {
    color: colores.textoClaro,
    fontSize: 22,
    fontWeight: '700',
  },
  divisor: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  barra: {
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  barraRelleno: {
    width: '30%',
    height: '100%',
    backgroundColor: MORADO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barraTexto: {
    color: colores.textoClaro,
    fontSize: 10,
  },
  mensajeFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mensaje: {
    color: colores.textoClaro,
    fontSize: 11,
  },
  hoja: {
    flex: 1,
    backgroundColor: colores.hojaClara,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  cuadricula: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 36,
  },
  celda: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 28,
  },
  fondoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  tarjetaModal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colores.fondoClaro,
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  tituloModal: {
    fontSize: 18,
    color: colores.textoPrincipal,
    textAlign: 'center',
  },
  campo: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
  },
  botones: {
    flexDirection: 'row',
    gap: 12,
  },
  botonCancelar: {
    flex: 1,
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colores.borde,
    alignItems: 'center',
  },
  textoCancelar: { color: colores.textoPrincipal },
  botonGuardar: {
    flex: 1,
    padding: 12,
    borderRadius: 24,
    backgroundColor: colores.primario,
    alignItems: 'center',
  },
  textoGuardar: { color: colores.textoClaro },
});