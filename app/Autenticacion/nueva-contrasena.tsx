// app/Autenticacion/nueva-contrasena.tsx
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import Boton from "@/components/ui/Boton";
import CampoContrasena from "@/components/ui/CampoContrasena";
import { espaciado } from "@/constants/espaciado";
import { errorConfirmacion, errorContrasena } from "@/utilidades/validadores";

export default function NuevaContrasena() {
  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [errores, setErrores] = useState<{ contrasena?: string; confirmacion?: string }>({});
  const [cargando, setCargando] = useState(false);

  function validar() {
    const nuevos = {
      contrasena: errorContrasena(contrasena),
      confirmacion: errorConfirmacion(contrasena, confirmacion),
    };
    setErrores(nuevos);
    return !nuevos.contrasena && !nuevos.confirmacion;
  }

  async function cambiarContrasena() {
    if (!validar()) return;

    setCargando(true);
    try {
      // TODO (Sprint 3): cambiar la contraseña con el backend
      await new Promise((resolver) => setTimeout(resolver, 600));

      router.replace({
        pathname: "/Autenticacion/exito",
        params: {
          mensaje: "La contraseña se ha cambiado correctamente.",
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
        <EncabezadoPantalla titulo="Nueva contraseña" mostrarCampana={false} />
      }
    >
      <CampoContrasena
        etiqueta="Nueva contraseña"
        valor={contrasena}
        onCambiar={setContrasena}
        error={errores.contrasena}
      />

      <CampoContrasena
        etiqueta="Confirmar nueva contraseña"
        valor={confirmacion}
        onCambiar={setConfirmacion}
        error={errores.confirmacion}
      />

      <View style={styles.boton}>
        <Boton
          texto="Cambiar contraseña"
          onPress={cambiarContrasena}
          cargando={cargando}
        />
      </View>
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  boton: {
    marginTop: espaciado.md,
  },
});