import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import CampoContrasena from "@/components/ui/CampoContrasena";
import { colores } from "@/constants/colores";
import {
  errorConfirmacion,
  errorContrasena,
} from "@/utilidades/validadores";

type Errores = {
  actual?: string;
  nueva?: string;
  confirmacion?: string;
};

export default function CambiarContrasena() {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [errores, setErrores] = useState<Errores>({});

  function validar() {
    const nuevosErrores: Errores = {
      actual: actual ? undefined : "Ingresa tu contraseña actual",
      nueva: errorContrasena(nueva),
      confirmacion: errorConfirmacion(nueva, confirmacion),
    };

    if (actual && nueva && actual === nueva) {
      nuevosErrores.nueva =
        "La nueva contraseña debe ser diferente de la actual";
    }

    setErrores(nuevosErrores);

    return Object.values(nuevosErrores).every(
      (mensaje) => !mensaje
    );
  }

  function cambiarContrasena() {
    if (!validar()) return;

    // Pendiente para Karen:
    // verificar la contraseña actual y actualizarla en Firebase.
    // Mostrar PantallaExito solo cuando el cambio sea exitoso.
  }

  return (
    <PantallaBase
      conBarra
      encabezado={
        <View style={styles.encabezado}>
          <EncabezadoPantalla titulo="Cambiar contraseña" />
        </View>
      }
    >
      <View style={styles.formulario}>
        <CampoContrasena
          etiqueta="Contraseña actual"
          valor={actual}
          onCambiar={setActual}
          error={errores.actual}
        />

        <View style={styles.separacion} />

        <CampoContrasena
          etiqueta="Nueva contraseña"
          valor={nueva}
          onCambiar={setNueva}
          error={errores.nueva}
        />

        <View style={styles.separacion} />

        <CampoContrasena
          etiqueta="Confirmar contraseña"
          valor={confirmacion}
          onCambiar={setConfirmacion}
          error={errores.confirmacion}
        />

        <Pressable
          onPress={cambiarContrasena}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.boton,
            pressed && styles.presionado,
          ]}
        >
          <Text style={styles.textoBoton}>
            Cambiar contraseña
          </Text>
        </Pressable>
      </View>
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    backgroundColor: colores.fondo,
    paddingBottom: 56,
  },
  formulario: {
    paddingTop: 8,
  },
  separacion: {
    height: 16,
  },
  boton: {
    alignSelf: "center",
    minHeight: 44,
    borderRadius: 24,
    backgroundColor: colores.acento,
    paddingHorizontal: 26,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
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