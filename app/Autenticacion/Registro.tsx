// app/Autenticacion/Registro.tsx
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import Boton from "@/components/ui/Boton";
import CampoContrasena from "@/components/ui/CampoContrasena";
import CampoTexto from "@/components/ui/CampoTexto";
import { espaciado } from "@/constants/espaciado";
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
      // TODO (Sprint 3): crear la cuenta con Firebase Authentication
      await new Promise((resolver) => setTimeout(resolver, 600));

      router.replace({
        pathname: "/Autenticacion/exito",
        params: {
          mensaje: "Tu cuenta se ha creado correctamente.",
          destino: "/Autenticacion/Iniciar-sesion",
        },
      });
    } finally {
      setCargando(false);
    }
  }

  return (
    <PantallaBase
      encabezado={
        <EncabezadoPantalla titulo="Crear una cuenta" mostrarCampana={false} />
      }
    >
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
          {/* El Figma dice "Acceder"; cámbialo a "Crear cuenta" si prefieren */}
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