import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import CampoContrasena from "@/components/ui/CampoContrasena";
import ModalConfirmacion from "@/components/ui/ModalConfirmacion";
import { colores } from "@/constants/colores";

export default function EliminarCuenta() {
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [mostrarModal, setMostrarModal] = useState(false);

  function solicitarEliminacion() {
    if (!contrasena) {
      setError("Ingresa tu contraseña");
      return;
    }

    setError(undefined);
    setMostrarModal(true);
  }

  function cancelarModal() {
    setMostrarModal(false);
  }

  function confirmarEliminacion() {
    setMostrarModal(false);
    setContrasena("");

    // Pendiente para Karen:
    // verificar identidad y eliminar la cuenta y sus datos.
    // Esta maqueta no elimina información.
  }

  return (
    <>
      <PantallaBase
        conBarra
        encabezado={
          <View style={styles.encabezado}>
            <EncabezadoPantalla titulo="Eliminar cuenta" />
          </View>
        }
      >
        <Text style={styles.pregunta}>
          ¿Estás seguro de que quieres eliminar tu cuenta?
        </Text>

        <View style={styles.aviso}>
          <Text style={styles.textoAviso}>
            Al eliminar tu cuenta, perderás el acceso a la
            información registrada en SmartPiggy.
          </Text>

          <Text style={styles.punto}>
            • Se eliminarán tus ingresos y gastos.
          </Text>

          <Text style={styles.punto}>
            • Se eliminarán tus metas de ahorro y sus aportes.
          </Text>

          <Text style={styles.punto}>
            • Se eliminarán tus categorías personales y los
            datos asociados a tu cuenta.
          </Text>

          <Text style={styles.advertencia}>
            Esta acción no se puede deshacer.
          </Text>
        </View>

        <Text style={styles.instruccion}>
          Introduce tu contraseña para solicitar la eliminación
          de tu cuenta.
        </Text>

        <CampoContrasena
          etiqueta="Contraseña"
          valor={contrasena}
          onCambiar={(valor) => {
            setContrasena(valor);
            setError(undefined);
          }}
          error={error}
        />

        <Pressable
          onPress={solicitarEliminacion}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.botonEliminar,
            pressed && styles.presionado,
          ]}
        >
          <Text style={styles.textoBoton}>
            Sí, eliminar cuenta
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.botonCancelar,
            pressed && styles.presionado,
          ]}
        >
          <Text style={styles.textoBoton}>
            Cancelar
          </Text>
        </Pressable>
      </PantallaBase>

      <ModalConfirmacion
        visible={mostrarModal}
        titulo="Eliminar cuenta"
        mensaje="¿Estás seguro de que quieres eliminar tu cuenta?"
        textoConfirmar="Sí, eliminar cuenta"
        textoCancelar="Cancelar"
        onConfirmar={confirmarEliminacion}
        onCancelar={cancelarModal}
      >
        <Text style={styles.textoModal}>
          Se eliminarán permanentemente tu cuenta y los datos
          asociados. Esta acción no se puede deshacer.
        </Text>
      </ModalConfirmacion>
    </>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    backgroundColor: colores.fondo,
    paddingBottom: 56,
  },
  pregunta: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    lineHeight: 22,
    color: colores.textoEtiqueta,
    textAlign: "center",
    marginBottom: 24,
  },
  aviso: {
    backgroundColor: colores.fondoClaro,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  textoAviso: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 20,
    color: colores.textoEtiqueta,
    marginBottom: 14,
  },
  punto: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 20,
    color: colores.textoEtiqueta,
    marginBottom: 12,
  },
  advertencia: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    lineHeight: 20,
    color: colores.textoEtiqueta,
    marginTop: 4,
  },
  instruccion: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 20,
    color: colores.textoEtiqueta,
    textAlign: "center",
    marginBottom: 20,
  },
  botonEliminar: {
    alignSelf: "center",
    minHeight: 44,
    borderRadius: 24,
    backgroundColor: colores.acento,
    paddingHorizontal: 26,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  botonCancelar: {
    alignSelf: "center",
    minWidth: 170,
    minHeight: 44,
    borderRadius: 24,
    backgroundColor: colores.fondoClaro,
    paddingHorizontal: 26,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  textoBoton: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.textoPrincipal,
    textAlign: "center",
  },
  textoModal: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: colores.textoEtiqueta,
    textAlign: "center",
    marginTop: 16,
  },
  presionado: {
    opacity: 0.75,
  },
});