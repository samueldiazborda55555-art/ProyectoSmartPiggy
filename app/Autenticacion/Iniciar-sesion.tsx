import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import PantallaBase from "@/components/disposicion/PantallaBase";
import Boton from "@/components/ui/Boton";
import CampoContrasena from "@/components/ui/CampoContrasena";
import CampoTexto from "@/components/ui/CampoTexto";
import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";
import { errorCorreo } from "@/utilidades/validadores";

export default function IniciarSesion() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState<{
    correo?: string;
    contrasena?: string;
  }>({});
  const [cargando, setCargando] = useState(false);

  function validar() {
    const nuevosErrores: typeof errores = {};
    const mensajeCorreo = errorCorreo(correo);
    if (mensajeCorreo) nuevosErrores.correo = mensajeCorreo;
    if (!contrasena.trim()) nuevosErrores.contrasena = "Ingresa tu contraseña";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function manejarIniciarSesion() {
    if (!validar()) return;

    setCargando(true);
    try {
      // TODO (Sprint 3): conectar con Firebase Authentication.
      await new Promise((resolver) => setTimeout(resolver, 600));
      router.replace("/Pestanas/Inicio");
    } finally {
      setCargando(false);
    }
  }

  return (
    <PantallaBase titulo={"Bienvenido De\nNuevo!"} alturaTitulo={0.3}>
      <Text style={styles.subtitulo}>
        {"Ingresa A Tu Cuenta Para Continuar\nGestionando Tus Finanzas."}
      </Text>

      <View style={styles.formulario}>
        <CampoTexto
          etiqueta="Correo Electrónico"
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errores.correo}
        />

        <CampoContrasena
          etiqueta="Contraseña"
          valor={contrasena}
          onCambiar={setContrasena}
          error={errores.contrasena}
        />

        <Link href="/Autenticacion/Olvide-contrasena" asChild>
          <TouchableOpacity style={styles.enlaceOlvide}>
            <Text style={styles.textoEnlace}>Olvido su contraseña?</Text>
          </TouchableOpacity>
        </Link>

        <Boton
          texto="INICIAR SESION"
          onPress={manejarIniciarSesion}
          cargando={cargando}
        />
      </View>
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  subtitulo: {
    ...tipografia.subtitulo,
    fontSize: 16,
    lineHeight: 22,
    color: colores.textoPrincipal,
    textAlign: "center",
    marginBottom: espaciado.xl,
  },
  formulario: {
    width: "100%",
  },
  enlaceOlvide: {
    alignSelf: "center",
    marginTop: espaciado.xs,
    marginBottom: espaciado.lg,
  },
  textoEnlace: {
    ...tipografia.pequeno,
    fontFamily: "Poppins_600SemiBold",
    color: colores.textoPrincipal,
  },
});
