import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colores } from "@/constants/colores";

type Props = {
  visible: boolean;
  titulo: string;
  mensaje?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  children?: ReactNode;
};

export default function ModalConfirmacion({
  visible,
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  onConfirmar,
  onCancelar,
  children,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancelar}
      statusBarTranslucent
    >
      <View style={styles.fondo}>
        <Pressable
          style={styles.capaFondo}
          onPress={onCancelar}
          accessibilityLabel="Cerrar ventana"
        />

        <View
          style={styles.tarjeta}
          accessibilityViewIsModal
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.contenido}
          >
            <Text style={styles.titulo}>{titulo}</Text>

            {!!mensaje && (
              <Text style={styles.mensaje}>{mensaje}</Text>
            )}

            {children}

            <View style={styles.botones}>
              <Pressable
                onPress={onConfirmar}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.boton,
                  styles.botonConfirmar,
                  pressed && styles.presionado,
                ]}
              >
                <Text style={styles.textoBoton}>
                  {textoConfirmar}
                </Text>
              </Pressable>

              <Pressable
                onPress={onCancelar}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.boton,
                  styles.botonCancelar,
                  pressed && styles.presionado,
                ]}
              >
                <Text style={styles.textoBoton}>
                  {textoCancelar}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: "rgba(3, 19, 20, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  capaFondo: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
},
  tarjeta: {
    width: "100%",
    maxWidth: 340,
    maxHeight: "85%",
    backgroundColor: "#DFE5DF",
    borderRadius: 22,
    overflow: "hidden",
  },
  contenido: {
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  titulo: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: colores.textoEtiqueta,
    textAlign: "center",
    marginBottom: 14,
  },
  mensaje: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: colores.textoPrincipal,
    textAlign: "center",
    marginBottom: 24,
  },
  botones: {
    alignItems: "center",
    gap: 10,
  },
  boton: {
    width: "100%",
    minHeight: 44,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  botonConfirmar: {
    backgroundColor: colores.acento,
  },
  botonCancelar: {
    backgroundColor: colores.mentaClara,
  },
  textoBoton: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.textoPrincipal,
    textAlign: "center",
  },
  presionado: {
    opacity: 0.75,
  },
});