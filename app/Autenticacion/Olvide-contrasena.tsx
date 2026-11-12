// app/Autenticacion/Olvide-contrasena.tsx
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import PantallaBase from "@/components/disposicion/PantallaBase";
import Boton from "@/components/ui/Boton";
import CampoTexto from "@/components/ui/CampoTexto";
import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";
import { enviarCorreoRecuperacion } from "@/servicios/servicioAutenticacion";
import { errorCorreo } from "@/utilidades/validadores";

export default function OlvideContrasena() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [cargando, setCargando] = useState(false);

  async function siguiente() {
    const mensaje = errorCorreo(correo);
    setError(mensaje);
    if (mensaje) return;

    setCargando(true);
    try {
      await enviarCorreoRecuperacion(correo.trim());
      router.replace({
        pathname: "/Autenticacion/exito",
        params: {
          mensaje: "Te enviamos un correo con un enlace para cambiar tu contraseña.",
          destino: "/Autenticacion/Iniciar-sesion",
        },
      });
    } catch (e: any) {
      const mensajes: Record<string, string> = {
        "auth/invalid-email": "El correo no es válido",
        "auth/too-many-requests": "Demasiados intentos, inténtalo más tarde",
      };
      Alert.alert("No se pudo enviar el correo", mensajes[e.code] ?? "Inténtalo de nuevo");
    } finally {
      setCargando(false);
    }
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
        <Boton texto="Siguiente" onPress={siguiente} cargando={cargando} />
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