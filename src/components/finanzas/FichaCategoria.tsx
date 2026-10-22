import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores } from '../../constants/colores';
import { Categoria, CategoriaId } from '../../tipos/categoria';

type NombreIcono = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const ICONOS: Record<CategoriaId, NombreIcono> = {
  comida: 'silverware-fork-knife',
  transporte: 'bus',
  medicina: 'pill',
  alimentos: 'basket-outline',
  alquiler: 'hand-coin-outline',
  regalos: 'gift-outline',
  ahorros: 'piggy-bank-outline',
  entretenimiento: 'ticket-outline',
  mas: 'plus',
};

// Azules del Figma (todavía no están en colores.ts)
const AZUL_CLARO = '#7CB9FF';
const AZUL_FUERTE = '#0066FF';

interface Props {
  categoria: Categoria;
  seleccionada?: boolean;
  alPresionar?: () => void;
}

export default function FichaCategoria({
  categoria,
  seleccionada = false,
  alPresionar,
}: Props) {
  const router = useRouter();

  const manejarToque = () => {
    if (alPresionar) {
      alPresionar();
    } else {
      router.push(`/Pestanas/Categorias/IdCategoria?idCategoria=${categoria.id}` as any);
    }
  };

  return (
    <Pressable style={styles.contenedor} onPress={manejarToque}>
      <View
        style={[
          styles.cuadro,
          { backgroundColor: seleccionada ? AZUL_FUERTE : AZUL_CLARO },
        ]}
      >
        <MaterialCommunityIcons
          name={ICONOS[categoria.id]}
          size={36}
          color={colores.textoClaro}
        />
      </View>
      <Text style={styles.nombre}>{categoria.nombre}</Text>
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