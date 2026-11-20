import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { colores } from "@/constants/colores";

type Props = {
  visible: boolean;
  mes: string;
  montoActual: number | null;
  onGuardar: (monto: number) => void;
  onCancelar: () => void;
};

function mostrarMonto(valor: string): string {
  return valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function ModalPresupuesto({
  visible,
  mes,
  montoActual,
  onGuardar,
  onCancelar,
}: Props) {
  const [monto, setMonto] = useState("");
  const [error, setError] = useState("");

  // Cada vez que se abre, carga el presupuesto actual.
  // Los cambios cancelados no se conservan.
  useEffect(() => {
    if (!visible) return;

    setMonto(
      montoActual !== null && montoActual > 0
        ? String(Math.round(montoActual))
        : "",
    );

    setError("");
  }, [visible, montoActual]);

  function cambiarMonto(texto: string) {
    const soloDigitos = texto.replace(/\D/g, "");

    setMonto(soloDigitos.slice(0, 12));
    setError("");
  }

  function guardar() {
    const valor = Number(monto);

    if (!monto || !Number.isFinite(valor) || valor <= 0) {
      setError("Ingresa un monto mayor que cero");
      return;
    }

    onGuardar(valor);
  }

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
          accessibilityRole="button"
          accessibilityLabel="Cerrar presupuesto mensual"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.zonaModal}
          pointerEvents="box-none"
        >
          <View style={styles.tarjeta} accessibilityViewIsModal>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.contenido}
            >
              <Pressable
                onPress={onCancelar}
                style={styles.cerrar}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Cerrar"
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={colores.textoPrincipal}
                />
              </Pressable>

              <View style={styles.icono}>
                <Ionicons
                  name="wallet-outline"
                  size={34}
                  color={colores.textoEtiqueta}
                />
              </View>

              <Text style={styles.titulo}>Presupuesto mensual</Text>

              <View style={styles.etiquetaMes}>
                <Text style={styles.textoMes}>{mes}</Text>
              </View>

              <Text style={styles.pregunta}>
                ¿Cuánto quieres gastar como máximo este mes?
              </Text>

              <Text style={styles.etiqueta}>Límite de gastos</Text>

              <View style={[styles.campoMonto, !!error && styles.campoError]}>
                <Text style={styles.simbolo}>$</Text>

                <TextInput
                  style={styles.input}
                  value={mostrarMonto(monto)}
                  onChangeText={cambiarMonto}
                  placeholder="800.000"
                  placeholderTextColor={colores.textoSecundario}
                  keyboardType="number-pad"
                  accessibilityLabel="Límite de gastos en pesos colombianos"
                  returnKeyType="done"
                  onSubmitEditing={guardar}
                />

                <Text style={styles.moneda}>COP</Text>
              </View>

              {!!error && (
                <Text style={styles.error} accessibilityLiveRegion="polite">
                  {error}
                </Text>
              )}

              <Text style={styles.ayuda}>
                Tú eliges el monto. No tiene que ser todo tu sueldo.
              </Text>

              <View style={styles.botones}>
                <Pressable
                  onPress={onCancelar}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.boton,
                    styles.botonCancelar,
                    pressed && styles.presionado,
                  ]}
                >
                  <Text style={styles.textoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  onPress={guardar}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.boton,
                    styles.botonGuardar,
                    pressed && styles.presionado,
                  ]}
                >
                  <Text style={styles.textoGuardar}>Guardar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: "rgba(3, 19, 20, 0.4)",
  },
  capaFondo: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  zonaModal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  tarjeta: {
    width: "100%",
    maxWidth: 390,
    maxHeight: "100%",
    backgroundColor: colores.fondoClaro,
    borderRadius: 26,
    overflow: "hidden",
  },
  contenido: {
    padding: 24,
  },
  cerrar: {
    alignSelf: "flex-end",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  icono: {
    alignSelf: "center",
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colores.mentaClara,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  titulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 21,
    lineHeight: 29,
    color: colores.textoEtiqueta,
    textAlign: "center",
    marginBottom: 12,
  },
  etiquetaMes: {
    alignSelf: "center",
    borderRadius: 18,
    backgroundColor: colores.mentaClara,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 22,
  },
  textoMes: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.textoEtiqueta,
    textAlign: "center",
  },
  pregunta: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: colores.textoPrincipal,
    textAlign: "center",
    marginBottom: 24,
  },
  etiqueta: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: colores.textoEtiqueta,
    marginBottom: 8,
  },
  campoMonto: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 58,
    paddingHorizontal: 14,
    backgroundColor: colores.hojaClara,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  campoError: {
    borderColor: colores.error,
  },
  simbolo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 23,
    color: colores.textoPrincipal,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 23,
    color: colores.textoPrincipal,
  },
  moneda: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: colores.textoEtiqueta,
  },
  error: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: colores.error,
    marginTop: 6,
  },
  ayuda: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: colores.textoEtiqueta,
    marginTop: 12,
    marginBottom: 26,
  },
  botones: {
    flexDirection: "row",
    gap: 12,
  },
  boton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 11,
  },
  botonCancelar: {
    backgroundColor: colores.mentaClara,
  },
  botonGuardar: {
    backgroundColor: colores.acento,
  },
  textoCancelar: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: colores.textoEtiqueta,
  },
  textoGuardar: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: colores.textoClaro,
  },
  presionado: {
    opacity: 0.75,
  },
});
