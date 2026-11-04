// app/Autenticacion/Verificar-pin.tsx
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import Boton from "@/components/ui/Boton";
import CampoPin from "@/components/ui/CampoPin";
import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";

const LONGITUD_PIN = 6;

export default function VerificarPin() {
  const { correo } = useLocalSearchParams<{ correo?: string }>();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | undefined>();

  function aceptar() {
    if (pin.length < LONGITUD_PIN) {
      setError(`Ingresa los ${LONGITUD_PIN} dígitos del PIN`);
      return;
    }
    setError(undefined);

    // TODO (Sprint 3): verificar el PIN con el backend
    router.push({
      pathname: "/Autenticacion/nueva-contrasena",
      params: { correo: correo ?? "" },
    });
  }

  function enviarDeNuevo() {
    // TODO (Sprint 3): pedir un PIN nuevo al backend
    setPin("");
    setError(undefined);
    Alert.alert(
      "Enviar de nuevo",
      "Aquí se reenviará el PIN cuando el backend esté conectado."
    );
  }

  return (
    <PantallaBase
      encabezado={
        <EncabezadoPantalla titulo="Pin de seguridad" mostrarCampana={false} />
      }
    >
      <Text style={styles.subtitulo}>Introduce el pin de seguridad</Text>

      <View style={styles.pin}>
        <CampoPin longitud={LONGITUD_PIN} valor={pin} onCambiar={setPin} />
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>

      <Boton texto="Aceptar" onPress={aceptar} />

      <View style={styles.segundoBoton}>
        <Boton texto="Enviar de nuevo" variante="secundario" onPress={enviarDeNuevo} />
      </View>
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  subtitulo: {
    ...tipografia.subtitulo,
    color: colores.textoPrincipal,
    textAlign: "center",
    marginBottom: espaciado.lg,
  },
  pin: {
    marginBottom: espaciado.xl,
  },
  error: {
    ...tipografia.pequeno,
    color: colores.error,
    textAlign: "center",
    marginTop: espaciado.md,
  },
  segundoBoton: {
    marginTop: espaciado.md,
  },
});