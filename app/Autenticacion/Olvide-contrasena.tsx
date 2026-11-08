// app/Autenticacion/Olvide-contrasena.tsx
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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
    <PantallaBase titulo="Olvidé Mi Contraseña" alturaTitulo={0.2}>
      <Text style={styles.subtitulo}>Restablecer Contraseña</Text>

      <CampoTexto
        etiqueta="Introduzca Correo Electrónico"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
        error={error}
      />

      <View style={styles.boton}>
        <Boton texto="Siguiente" onPress={siguiente} />
      </View>
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  subtitulo: {
    ...tipografia.subtitulo,
    color: colores.textoPrincipal,
    marginBottom: espaciado.xl,
  },
  boton: {
    marginTop: espaciado.lg,
  },
});