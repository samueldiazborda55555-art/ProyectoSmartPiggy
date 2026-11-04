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
          { backgroundColor: seleccionada ? colores.azul : colores.azulClaro },
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
  fontWeight: '600',
  color: colores.textoPrincipal,
  textAlign: 'center',
},
});