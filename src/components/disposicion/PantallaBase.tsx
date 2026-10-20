// src/componentes/disposicion/PantallaBase.tsx
import { ReactNode } from "react";
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colores } from "../../constants/colores";
import { espaciado, radios } from "../../constants/espaciado";

type Props = {
  children: ReactNode;
  encabezado?: ReactNode; // normalmente un <EncabezadoPantalla />
  conScroll?: boolean;
  estiloHoja?: StyleProp<ViewStyle>;
};

// El marco que se repite en casi todas las pantallas del Figma:
// una franja oscura arriba (donde va el encabezado) y, debajo,
// una "hoja" clara con las esquinas superiores redondeadas.
export default function PantallaBase({
  children,
  encabezado,
  conScroll = true,
  estiloHoja,
}: Props) {
  const Contenedor = conScroll ? ScrollView : View;

  return (
    <View style={styles.fondo}>
      {encabezado}
      <Contenedor
        style={[styles.hoja, estiloHoja]}
        contentContainerStyle={conScroll ? styles.contenidoScroll : undefined}
      >
        {children}
      </Contenedor>
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colores.fondoOscuro,
  },
  hoja: {
    flex: 1,
    backgroundColor: colores.hojaClara,
    borderTopLeftRadius: radios.hoja,
    borderTopRightRadius: radios.hoja,
  },
  contenidoScroll: {
    padding: espaciado.lg,
    paddingBottom: espaciado.xxl,
  },
});
