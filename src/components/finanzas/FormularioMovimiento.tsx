import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CATEGORIAS } from '../../constants/categorias';
import { colores } from '../../constants/colores';
import { espaciado, radios } from '../../constants/espaciado';
import { tipografia } from '../../constants/tipografia';
import CampoTexto from '../ui/CampoTexto';

// Verde del Figma (todavía no está en colores.ts)
const VERDE = '#0e8a4b';

export interface Opcion {
  id: string;
  nombre: string;
}

export interface DatosFormulario {
  fecha: string;
  opcionId: string | null;
  monto: number;
  nombre: string;
  mensaje: string;
}

interface Props {
  // Lista del selector: categorías (gasto) o metas (ahorro)
  opciones?: Opcion[];
  etiquetaOpcion?: string;
  textoOpcion?: string;
  opcionInicial?: string;
  // Función que recibe todos los datos al presionar Guardar
  onGuardar?: (datos: DatosFormulario) => void;
}

export default function FormularioMovimiento({
  opciones = CATEGORIAS.filter((c) => c.id !== 'mas'),
  etiquetaOpcion = 'Categoría',
  textoOpcion = 'Selecciona la categoría',
  opcionInicial,
  onGuardar,
}: Props) {
  const [fecha, setFecha] = useState('');
  const [opcionId, setOpcionId] = useState<string | null>(opcionInicial ?? null);
  const [abierto, setAbierto] = useState(false);
  const [monto, setMonto] = useState('');
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const seleccionada = opciones.find((o) => o.id === opcionId);

  const guardar = () => {
    onGuardar?.({
      fecha,
      opcionId,
      monto: Number(monto.replace(/[^0-9.]/g, '')) || 0,
      nombre,
      mensaje,
    });
  };

  return (
    <View style={styles.formulario}>
      <View>
        <CampoTexto
          etiqueta="Fecha"
          placeholder="Abril 30, 2026"
          value={fecha}
          onChangeText={setFecha}
        />
        <View pointerEvents="none" style={styles.iconoFecha}>
          <Ionicons name="calendar-outline" size={14} color="#ffffff" />
        </View>
      </View>

      <View style={styles.bloque}>
        <Text style={styles.etiqueta}>{etiquetaOpcion}</Text>
        <Pressable style={styles.selector} onPress={() => setAbierto(!abierto)}>
          <Text
            style={[
              styles.textoSelector,
              !seleccionada && { color: colores.textoSecundario },
            ]}
          >
            {seleccionada ? seleccionada.nombre : textoOpcion}
          </Text>
          <Ionicons
            name={abierto ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={VERDE}
          />
        </Pressable>
        {abierto && (
          <View style={styles.lista}>
            {opciones.map((o) => (
              <Pressable
                key={o.id}
                style={styles.item}
                onPress={() => {
                  setOpcionId(o.id);
                  setAbierto(false);
                }}
              >
                <Text
                  style={[
                    styles.textoItem,
                    o.id === opcionId && { color: VERDE, fontWeight: '600' },
                  ]}
                >
                  {o.nombre}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <CampoTexto
        etiqueta="Monto"
        placeholder="$150,000"
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
      />

      <CampoTexto
        etiqueta="Nombre De Gastos"
        placeholder="Cena"
        value={nombre}
        onChangeText={setNombre}
      />

      <View style={styles.bloque}>
        <TextInput
          style={styles.mensaje}
          placeholder="Introducir Mensaje"
          placeholderTextColor={colores.textoSecundario}
          multiline
          value={mensaje}
          onChangeText={setMensaje}
        />
      </View>

      <Pressable style={styles.boton} onPress={guardar}>
        <Text style={styles.textoBoton}>Guardar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  formulario: { width: '100%' },
  iconoFecha: {
    position: 'absolute',
    right: 12,
    bottom: espaciado.md + 12,
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: VERDE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloque: { marginBottom: espaciado.md },
  etiqueta: {
    ...tipografia.etiqueta,
    color: colores.textoPrincipal,
    marginBottom: espaciado.xs + 2,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colores.fondoClaro,
    borderRadius: radios.campo,
    paddingHorizontal: espaciado.md,
    paddingVertical: 14,
  },
  textoSelector: { ...tipografia.texto, color: colores.textoPrincipal },
  lista: {
    marginTop: 4,
    backgroundColor: colores.fondoClaro,
    borderRadius: radios.campo,
    overflow: 'hidden',
  },
  item: { paddingVertical: 12, paddingHorizontal: espaciado.md },
  textoItem: { ...tipografia.texto, color: colores.textoPrincipal },
  mensaje: {
    backgroundColor: colores.fondoClaro,
    borderRadius: radios.campo,
    padding: espaciado.md,
    height: 130,
    textAlignVertical: 'top',
    ...tipografia.texto,
    color: colores.textoPrincipal,
  },
  boton: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 48,
    borderRadius: 20,
    backgroundColor: VERDE,
  },
  textoBoton: { color: '#ffffff', fontWeight: '600' },
});