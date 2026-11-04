import { ReactNode } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colores } from "@/constants/colores";
import { espaciado, radios } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";

type Props = {
  children: ReactNode;
  encabezado?: ReactNode;   // <EncabezadoPantalla /> (flecha + título + campana)
  titulo?: string;          // título grande en la zona blanca (si no hay encabezado)
  alturaTitulo?: number;    // fracción de la pantalla que ocupa la zona blanca (0 a 1)
  conScroll?: boolean;
  conBarra?: boolean;       // true si la pantalla tiene la barra verde inferior
  estiloHoja?: StyleProp<ViewStyle>;
};

const ALTURA_BARRA = 108;

export default function PantallaBase({
  children,
  encabezado,
  titulo,
  alturaTitulo = 0.28,
  conScroll = true,
  conBarra = false,
  estiloHoja,
}: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const contenido: ViewStyle = {
    paddingHorizontal: espaciado.hoja,
    paddingTop: espaciado.lg,
    paddingBottom: conBarra ? ALTURA_BARRA + espaciado.md : insets.bottom + espaciado.xl,
  };

  return (
    <View style={styles.fondo}>
      {encabezado}

      {!encabezado && !!titulo && (
        <View
          style={[
            styles.zonaTitulo,
            { height: height * alturaTitulo, paddingTop: insets.top },
          ]}
        >
          <Text style={styles.titulo}>{titulo}</Text>
        </View>
      )}

      {!encabezado && !titulo && <View style={{ height: insets.top }} />}

      {conScroll ? (
        <ScrollView
          style={[styles.hoja, estiloHoja]}
          contentContainerStyle={contenido}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.hoja, contenido, estiloHoja]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  zonaTitulo: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espaciado.lg,
  },
  titulo: {
    ...tipografia.titulo,
    color: colores.textoPrincipal,
    textAlign: "center",
  },
  hoja: {
    flex: 1,
    backgroundColor: colores.hojaClara,
    borderTopLeftRadius: radios.hoja,
    borderTopRightRadius: radios.hoja,
    overflow: "hidden",
  },
});