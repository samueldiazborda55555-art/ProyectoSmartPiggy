import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import { colores } from "@/constants/colores";

type OpcionProps = {
  icono: React.ComponentProps<typeof Ionicons>["name"];
  texto: string;
  onPress: () => void;
};

function Opcion({ icono, texto, onPress }: OpcionProps) {
  return (
    <TouchableOpacity
      style={styles.opcion}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <View style={styles.icono}>
        <Ionicons
          name={icono}
          size={21}
          color={colores.textoEtiqueta}
        />
      </View>

      <Text style={styles.texto}>{texto}</Text>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={colores.textoEtiqueta}
      />
    </TouchableOpacity>
  );
}

export default function Configuracion() {
  return (
    <PantallaBase
      conBarra
      encabezado={
        <View style={styles.encabezado}>
          <EncabezadoPantalla titulo="Configuración" />
        </View>
      }
    >
      <View style={styles.lista}>
        <Opcion
          icono="notifications-outline"
          texto="Notificaciones"
          onPress={() =>
            router.push("/Pestanas/Perfil/Configuracion/Notificaciones")
          }
        />

        <Opcion
          icono="key-outline"
          texto="Contraseña"
          onPress={() =>
            router.push("/Pestanas/Perfil/Configuracion/Cambiar-contrasena")
          }
        />

        <Opcion
          icono="person-outline"
          texto="Eliminar cuenta"
          onPress={() =>
            router.push("/Pestanas/Perfil/Configuracion/Eliminar-cuenta")
          }
        />
      </View>
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    backgroundColor: colores.fondo,
    paddingBottom: 56,
  },
  lista: {
    paddingTop: 8,
    gap: 10,
  },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 54,
    gap: 14,
  },
  icono: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colores.menta,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: colores.textoEtiqueta,
  },
});