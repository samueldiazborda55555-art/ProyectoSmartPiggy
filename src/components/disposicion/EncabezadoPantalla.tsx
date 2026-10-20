// src/componentes/disposicion/EncabezadoPantalla.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colores } from "../../constants/colores";
import { espaciado } from "../../constants/espaciado";
import { tipografia } from "../../constants/tipografia";

type Props = {
  titulo?: string;
  mostrarFlecha?: boolean;
  mostrarCampana?: boolean;
  onPresionarCampana?: () => void;
};

export default function EncabezadoPantalla({
  titulo,
  mostrarFlecha = true,
  mostrarCampana = true,
  onPresionarCampana,
}: Props) {
  return (
    <View style={styles.fila}>
      {mostrarFlecha ? (
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={colores.textoClaro} />
        </TouchableOpacity>
      ) : (
        <View style={styles.espacioVacio} />
      )}

      <Text style={styles.titulo} numberOfLines={1}>
        {titulo}
      </Text>

      {mostrarCampana ? (
        <TouchableOpacity
          onPress={onPresionarCampana ?? (() => router.push("/Notificaciones"))}
          hitSlop={10}
          style={styles.campana}
        >
          <Ionicons name="notifications-outline" size={20} color={colores.acento} />
        </TouchableOpacity>
      ) : (
        <View style={styles.espacioVacio} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: espaciado.lg,
    paddingTop: espaciado.lg,
    paddingBottom: espaciado.md,
  },
  titulo: {
    ...tipografia.subtitulo,
    color: colores.textoClaro,
    flex: 1,
    textAlign: "center",
  },
  campana: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colores.hojaClara,
    alignItems: "center",
    justifyContent: "center",
  },
  espacioVacio: {
    width: 24,
  },
});
