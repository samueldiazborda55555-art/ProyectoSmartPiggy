import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import PantallaBase from "@/components/disposicion/PantallaBase";
import Boton from "@/components/ui/Boton";
import CampoContrasena from "@/components/ui/CampoContrasena";
import CampoTexto from "@/components/ui/CampoTexto";
import { colores } from "@/constants/colores";
import { espaciado, radios } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";

export default function IniciarSesion() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState<{ correo?: string; contrasena?: string }>({});
  const [cargando, setCargando] = useState(false);

  function validar() {
    const nuevosErrores: typeof errores = {};
    if (!correo.trim()) nuevosErrores.correo = "Ingresa tu correo electrónico";
    if (!contrasena.trim()) nuevosErrores.contrasena = "Ingresa tu contraseña";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function manejarIniciarSesion() {
    if (!validar()) return;

    setCargando(true);
    try {
      // TODO (Sprint 2): conectar con servicioAutenticacion real.
      await new Promise((resolver) => setTimeout(resolver, 600));
      router.replace("/Pestanas/Inicio");
    } finally {
      setCargando(false);
    }
  }

  return (
    <PantallaBase estiloHoja={styles.hojaContenedora}>
      {/* Parte superior blanca con más espacio superior */}
      <View style={styles.seccionSuperiorBlanca}>
        <Text style={styles.titulo}>{"Bienvenido De\nNuevo!"}</Text>
      </View>

      {/* Tarjeta verde que baja hasta el fondo de la pantalla */}
      <View style={styles.tarjetaVerde}>
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
      </View>
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  hojaContenedora: {
    backgroundColor: colores.fondoClaro,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 0,
    marginHorizontal: -espaciado.lg,
    marginTop: -espaciado.lg,
    flexGrow: 1,
  },
  seccionSuperiorBlanca: {
    backgroundColor: colores.fondoClaro,
    paddingTop: espaciado.xxl * 1.5, // Mayor separación desde la parte superior
    paddingBottom: espaciado.xxl,    // Espacio inferior ampliado antes de la tarjeta verde
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    ...tipografia.titulo,
    color: colores.textoPrincipal,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 36,
  },
  tarjetaVerde: {
    backgroundColor: colores.hojaClara,
    borderTopLeftRadius: radios.hoja,
    borderTopRightRadius: radios.hoja,
    paddingHorizontal: espaciado.lg,
    paddingTop: espaciado.xl,
    paddingBottom: 120, // Relleno inferior amplio para asegurar que llegue hasta el borde inferior
    width: "100%",
    flex: 1,
    minHeight: 700,     // Asegura que cubra todo el alto de pantallas largas
  },
  subtitulo: {
    ...tipografia.titulo,
    color: colores.textoPrincipal,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
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
    color: colores.textoPrincipal,
    fontWeight: "bold",
  },
});