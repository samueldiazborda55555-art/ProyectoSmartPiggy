import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores } from '../../constants/colores';
import { Meta } from '../../tipos/meta';

type NombreIcono = ComponentProps<typeof MaterialCommunityIcons>['name'];

// Azules del Figma (todavía no están en colores.ts)
const AZUL_CLARO = '#7CB9FF';
const AZUL_FUERTE = '#0066FF';

interface Props {
  meta: Meta;
  seleccionada?: boolean;
  alPresionar: () => void;
}

export default function TarjetaMeta({
  meta,
  seleccionada = false,
  alPresionar,
}: Props) {
  return (
    <Pressable style={styles.contenedor} onPress={alPresionar}>
      <View
        style={[
          styles.cuadro,
          { backgroundColor: seleccionada ? AZUL_FUERTE : AZUL_CLARO },
        ]}
      >
        <MaterialCommunityIcons
          name={meta.icono as NombreIcono}
          size={36}
          color={colores.textoClaro}
        />
      </View>
      <Text style={styles.nombre}>{meta.nombre}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    gap: 6,
  },
  cuadro: {
    width: 76,
    height: 76,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nombre: {
    fontSize: 11,
    color: colores.textoPrincipal,
    textAlign: 'center',
  },
});