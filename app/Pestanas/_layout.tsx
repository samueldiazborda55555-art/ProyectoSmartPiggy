
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

          // Altura definida en espaciado.ts
          height: medidas.alturaBarra + insets.bottom,

          // Posición de los íconos
          paddingTop: 25,
          paddingBottom: insets.bottom,

          // Fondo verde
          backgroundColor: colores.acento,

          // Bordes redondeados definidos en espaciado.ts
          borderTopLeftRadius: radios.barra,
          borderTopRightRadius: radios.barra,

          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },

          tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        },

          tabBarIconStyle: {
          alignItems: "center",
          justifyContent: "center",
          marginTop: 12,
        },

      }}
    >
      <Tabs.Screen
        name="Inicio"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconoPestana
              nombre="home-outline"
              activo={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Analisis"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconoPestana
              nombre="analytics-outline"
              activo={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Movimientos"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconoPestana
              nombre="swap-horizontal-outline"
              activo={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Categorias"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconoPestana
              nombre="layers-outline"
              activo={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Perfil"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconoPestana
              nombre="person-outline"
              activo={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
