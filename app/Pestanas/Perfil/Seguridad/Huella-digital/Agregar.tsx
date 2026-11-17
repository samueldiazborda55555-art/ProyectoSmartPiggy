import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import { colores } from "@/constants/colores";

export default function ConfigurarBiometria() {
  return (
    <PantallaBase
      conBarra
      encabezado={
        <View style={styles.encabezado}>
          <EncabezadoPantalla titulo="Configurar biometría" />
        </View>
      }
    >
      <View style={styles.contenido}>
        <View style={styles.circulo}>
          <Ionicons
            name="finger-print-outline"
            size={100}
            color={colores.textoClaro}
          />
        </View>

        <Text style={styles.titulo}>
          Usa la biometría para acceder
        </Text>

        <Text style={styles.descripcion}>
          Utiliza la huella o el reconocimiento facial disponible
          en tu teléfono para desbloquear SmartPiggy.
        </Text>

        <TouchableOpacity
          style={styles.boton}
          activeOpacity={0.8}
          onPress={() =>
            router.push("/Pestanas/Perfil/Seguridad/Huella-digital/Terminos")
          }
          accessibilityRole="button"
        >
          <Text style={styles.textoBoton}>
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    paddingBottom: 56,
    backgroundColor: colores.fondo,
  },
  contenido: {
    alignItems: "center",
    paddingTop: 20,
  },
  circulo: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: colores.azulClaro,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  titulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 19,
    color: colores.textoEtiqueta,
    textAlign: "center",
    marginBottom: 14,
  },
  descripcion: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 21,
    color: colores.textoEtiqueta,
    textAlign: "center",
  },
  boton: {
    width: "100%",
    minHeight: 48,
    borderRadius: 26,
    backgroundColor: colores.fondoClaro,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 48,
  },
  textoBoton: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: colores.textoEtiqueta,
    textAlign: "center",
  },
});