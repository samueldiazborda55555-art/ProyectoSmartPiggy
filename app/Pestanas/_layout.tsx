import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import IconoPestana from "@/components/disposicion/IconoPestana";
import { colores } from "@/constants/colores";
import { medidas, radios } from "@/constants/espaciado";

export default function LayoutPestanas() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: medidas.alturaBarra + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: colores.acento,
          borderTopLeftRadius: radios.barra,
          borderTopRightRadius: radios.barra,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="Inicio"
        options={{ tabBarIcon: ({ focused }) => <IconoPestana nombre="home-outline" activo={focused} /> }}
      />
      <Tabs.Screen
        name="Analisis"
        options={{ tabBarIcon: ({ focused }) => <IconoPestana nombre="analytics-outline" activo={focused} /> }}
      />
      <Tabs.Screen
        name="Movimientos"
        options={{ tabBarIcon: ({ focused }) => <IconoPestana nombre="swap-horizontal-outline" activo={focused} /> }}
      />
      <Tabs.Screen
        name="Categorias"
        options={{ tabBarIcon: ({ focused }) => <IconoPestana nombre="layers-outline" activo={focused} /> }}
      />
      <Tabs.Screen
        name="Perfil"
        options={{ tabBarIcon: ({ focused }) => <IconoPestana nombre="person-outline" activo={focused} /> }}
      />
    </Tabs>
  );
}