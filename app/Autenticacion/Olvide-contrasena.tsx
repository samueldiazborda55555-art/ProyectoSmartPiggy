// app/Autenticacion/Olvide-contrasena.tsx
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import Boton from "@/components/ui/Boton";
import CampoTexto from "@/components/ui/CampoTexto";
import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";
import { errorCorreo } from "@/utilidades/validadores";

export default function OlvideContrasena() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState<string | undefined>();

  function siguiente() {
    const mensaje = errorCorreo(correo);
    setError(mensaje);
    if (mensaje) return;

    router.push({
      pathname: "/Autenticacion/Verificar-pin",
      params: { correo: correo.trim() },
    });
  }

  return (
    <PantallaBase
      encabezado={
        <EncabezadoPantalla titulo="Olvidé mi contraseña" mostrarCampana={false} />
      }
    >
      <Text style={styles.subtitulo}>Restablecer contraseña</Text>

      <CampoTexto
        etiqueta="Introduzca correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
        error={error}
      />

      <Boton texto="Siguiente" onPress={siguiente} />
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  subtitulo: {
    ...tipografia.subtitulo,
    color: colores.textoPrincipal,
    marginBottom: espaciado.lg,
  },
});