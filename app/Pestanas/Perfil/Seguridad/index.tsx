import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import { colores } from "@/constants/colores";

export default function Seguridad() {
  return (
    <PantallaBase
      conBarra
      encabezado={
        <View style={styles.encabezado}>
          <EncabezadoPantalla titulo="Seguridad" />
        </View>
      }
    >
      <Text style={styles.titulo}>Seguridad</Text>

      <TouchableOpacity
        style={styles.opcion}
        onPress={() =>
          router.push("/Pestanas/Perfil/Seguridad/Cambiar-pin")
        }
        activeOpacity={0.7}
      >
        <Text style={styles.texto}>Crear o cambiar PIN</Text>

        <Ionicons
          name="chevron-forward"
          size={21}
          color={colores.textoEtiqueta}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.opcion}
        onPress={() =>
          router.push("/Pestanas/Perfil/Seguridad/Huella-digital")
        }
        activeOpacity={0.7}
      >
        <Text style={styles.texto}>Acceso biométrico</Text>

        <Ionicons
          name="chevron-forward"
          size={21}
          color={colores.textoEtiqueta}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.opcion}
        onPress={() =>
          router.push("/Pestanas/Perfil/Seguridad/Terminos")
        }
        activeOpacity={0.7}
      >
        <Text style={styles.texto}>Términos y condiciones</Text>

        <Ionicons
          name="chevron-forward"
          size={21}
          color={colores.textoEtiqueta}
        />
      </TouchableOpacity>
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    paddingBottom: 56,
    backgroundColor: colores.fondo,
  },
  titulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 19,
    color: colores.textoEtiqueta,
    marginBottom: 24,
    marginTop: 4,
  },
  opcion: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  texto: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: colores.textoEtiqueta,
  },
});