// app/Autenticacion/Registro.tsx
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import PantallaBase from "@/components/disposicion/PantallaBase";
import Boton from "@/components/ui/Boton";
import CampoContrasena from "@/components/ui/CampoContrasena";
import CampoTexto from "@/components/ui/CampoTexto";
import { espaciado } from "@/constants/espaciado";
import { registrarUsuario } from "@/servicios/servicioAutenticacion";
import {
  errorConfirmacion,
  errorContrasena,
  errorCorreo,
  errorFecha,
  errorObligatorio,
  errorTelefono,
} from "@/utilidades/validadores";

type Errores = {
  nombre?: string;
  correo?: string;
  telefono?: string;
  fecha?: string;
  contrasena?: string;
  confirmacion?: string;
};

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [cargando, setCargando] = useState(false);

  function validar() {
    const nuevos: Errores = {
      nombre: errorObligatorio(nombre, "Ingresa tu nombre completo"),
      correo: errorCorreo(correo),
      telefono: errorTelefono(telefono),
      fecha: errorFecha(fecha),
      contrasena: errorContrasena(contrasena),
      confirmacion: errorConfirmacion(contrasena, confirmacion),
    };
    setErrores(nuevos);
    return Object.values(nuevos).every((e) => !e);
  }

  async function manejarRegistro() {
    if (!validar()) return;

    setCargando(true);
    try {
      await registrarUsuario(correo.trim(), contrasena, {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        fechaNacimiento: fecha.trim(),
      });

      router.replace({
        pathname: "/Autenticacion/exito",
        params: {
          mensaje: "Tu cuenta se ha creado correctamente.",
          destino: "/Autenticacion/Iniciar-sesion",
        },
      });
    } catch (error: any) {
      const mensajes: Record<string, string> = {
        "auth/email-already-in-use": "Ese correo ya está registrado",
        "auth/invalid-email": "El correo no es válido",
        "auth/weak-password": "La contraseña es muy débil",
        "auth/operation-not-allowed":
          "El registro con correo no está activado en Firebase",
      };
      Alert.alert(
        "No se pudo crear la cuenta",
        mensajes[error.code] ?? "Ocurrió un error, inténtalo de nuevo"
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <PantallaBase titulo="Crear Una Cuenta" alturaTitulo={0.17}>
      <View style={styles.formulario}>
        <CampoTexto
          etiqueta="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
          autoCapitalize="words"
          error={errores.nombre}
        />

        <CampoTexto
          etiqueta="Email"
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errores.correo}
        />

        <CampoTexto
          etiqueta="Número de teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
          error={errores.telefono}
        />

        <CampoTexto
          etiqueta="Fecha de nacimiento"
          value={fecha}
          onChangeText={setFecha}
          placeholder="DD/MM/AAAA"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          error={errores.fecha}
        />

        <CampoContrasena
          etiqueta="Contraseña"
          valor={contrasena}
          onCambiar={setContrasena}
          error={errores.contrasena}
        />

        <CampoContrasena
          etiqueta="Confirmar contraseña"
          valor={confirmacion}
          onCambiar={setConfirmacion}
          error={errores.confirmacion}
        />

        <View style={styles.boton}>
          <Boton texto="Acceder" onPress={manejarRegistro} cargando={cargando} />
        </View>
      </View>
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  formulario: {
    width: "100%",
  },
  boton: {
    marginTop: espaciado.md,
  },
});