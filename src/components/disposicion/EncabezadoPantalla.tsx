import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";

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
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.fila, { paddingTop: insets.top + espaciado.md }]}>
      {mostrarFlecha ? (
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={colores.textoPrincipal} />
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
          <Ionicons name="notifications-outline" size={20} color={colores.textoEtiqueta} />
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
    paddingBottom: espaciado.lg,
    backgroundColor: colores.fondo,
  },
  titulo: {
    ...tipografia.subtitulo,
    color: colores.textoPrincipal,
    flex: 1,
    textAlign: "center",
  },
  campana: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colores.mentaClara,
    alignItems: "center",
    justifyContent: "center",
  },
  espacioVacio: {
    width: 34,
  },
});