import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colores } from "@/constants/colores";
import { medidas, radios } from "@/constants/espaciado";

type NombreIcono = React.ComponentProps<typeof Ionicons>["name"];

// La clave es el nombre exacto de la carpeta de cada pestaña
const ICONOS: Record<string, NombreIcono> = {
  Inicio: "home-outline",
  Analisis: "analytics-outline",
  Movimientos: "swap-horizontal-outline",
  Categorias: "layers-outline",
  Perfil: "person-outline",
};

type Props = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: any;
};

export default function BarraNavegacion({ state, navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.barra,
        {
          height: medidas.alturaBarra + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {state.routes.map((ruta, i) => {
        const activo = state.index === i;

        const alPresionar = () => {
          const evento = navigation.emit({
            type: "tabPress",
            target: ruta.key,
            canPreventDefault: true,
          });
          if (!activo && !evento.defaultPrevented) {
            navigation.navigate(ruta.name);
          }
        };

        return (
          <Pressable
            key={ruta.key}
            onPress={alPresionar}
            style={styles.item}
            accessibilityRole="button"
            accessibilityLabel={ruta.name}
            accessibilityState={{ selected: activo }}
          >
            <View style={[styles.icono, activo && styles.iconoActivo]}>
              <Ionicons
                name={ICONOS[ruta.name] ?? "ellipse-outline"}
                size={28}
                color={colores.textoPrincipal}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: colores.acento,
    borderTopLeftRadius: radios.barra,
    borderTopRightRadius: radios.barra,
  },
  item: {
    flex: 1,
    height: medidas.alturaBarra,
    alignItems: "center",
    justifyContent: "center",
  },
  icono: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  iconoActivo: {
    backgroundColor: colores.fondoClaro,
  },
});