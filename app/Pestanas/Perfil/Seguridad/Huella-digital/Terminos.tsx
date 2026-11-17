import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import { colores } from "@/constants/colores";
import { activarBiometria } from "@/servicios/servicioBiometria";

export default function TerminosBiometria() {
  const [acepta, setAcepta] = useState(false);
  const [activando, setActivando] = useState(false);
  const [activada, setActivada] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Evita iniciar varias verificaciones con toques rápidos.
  const verificacionEnCurso = useRef(false);

  async function aceptarBiometria() {
    if (!acepta || verificacionEnCurso.current || activada) {
      return;
    }

    verificacionEnCurso.current = true;
    setActivando(true);
    setMensaje("");

    try {
      const resultado = await activarBiometria();

      if (!resultado) {
        setMensaje(
          "Verificación cancelada. No se activó la biometría."
        );
        return;
      }

      setActivada(true);
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : "No se pudo activar la biometría. Inténtalo nuevamente."
      );
    } finally {
      verificacionEnCurso.current = false;
      setActivando(false);
    }
  }

  function continuar() {
    router.replace(
      "/Pestanas/Perfil/Seguridad/Huella-digital"
    );
  }

  return (
    <PantallaBase
      conBarra
      encabezado={
        <View style={styles.encabezado}>
          <EncabezadoPantalla titulo="Verificación biométrica" />
        </View>
      }
    >
      {activada ? (
        <View style={styles.exito}>
          <View style={styles.circuloExito}>
            <Ionicons
              name="checkmark"
              size={54}
              color={colores.textoClaro}
            />
          </View>

          <Text style={styles.titulo}>
            Biometría activada
          </Text>

          <Text style={styles.descripcionExito}>
            Se guardó tu preferencia de acceso biométrico
            en este dispositivo.
          </Text>

          <Pressable
            onPress={continuar}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.boton,
              pressed && styles.presionado,
            ]}
          >
            <Text style={styles.textoBoton}>
              Continuar
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Text style={styles.titulo}>
            Acceso biométrico
          </Text>

          <Text style={styles.parrafo}>
            Esta función permitirá desbloquear SmartPiggy
            mediante la biometría configurada en tu teléfono.
          </Text>

          <Text style={styles.subtitulo}>
            Cómo funciona
          </Text>

          <Text style={styles.parrafo}>
            El teléfono realizará la verificación. SmartPiggy
            recibirá únicamente el resultado de esa
            comprobación; no recibirá imágenes de tu huella
            ni de tu rostro.
          </Text>

          <Text style={styles.subtitulo}>
            Configuración del dispositivo
          </Text>

          <Text style={styles.parrafo}>
            Para utilizar esta función, tu dispositivo debe
            ser compatible y tener una huella o un método
            biométrico registrado. Esta información se
            administra desde los ajustes del teléfono.
          </Text>

          <Text style={styles.subtitulo}>
            Control del acceso
          </Text>

          <Text style={styles.parrafo}>
            Al habilitar esta opción, la biometría registrada
            en el dispositivo podrá utilizarse para
            desbloquear la aplicación. Podrás desactivar
            esta preferencia desde Seguridad.
          </Text>

          <Text style={styles.subtitulo}>
            Privacidad
          </Text>

          <Text style={styles.parrafo}>
            SmartPiggy no agrega, almacena ni elimina las
            huellas del teléfono. Desactivar esta función
            únicamente cambia la preferencia de acceso
            biométrico de la aplicación.
          </Text>

          <Pressable
            disabled={activando}
            onPress={() => {
              setAcepta((valor) => !valor);
              setMensaje("");
            }}
            style={styles.filaAceptacion}
            accessibilityRole="checkbox"
            accessibilityState={{
              checked: acepta,
              disabled: activando,
            }}
            accessibilityLabel="Acepto el uso del acceso biométrico"
          >
            <View
              style={[
                styles.casilla,
                acepta && styles.casillaActiva,
              ]}
            >
              {acepta && (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={colores.textoClaro}
                />
              )}
            </View>

            <Text style={styles.textoAceptacion}>
              He leído y acepto el uso del acceso biométrico.
            </Text>
          </Pressable>

          <Pressable
            disabled={!acepta || activando}
            onPress={aceptarBiometria}
            accessibilityRole="button"
            accessibilityState={{
              disabled: !acepta || activando,
              busy: activando,
            }}
            style={({ pressed }) => [
              styles.boton,
              (!acepta || activando) && styles.deshabilitado,
              pressed && styles.presionado,
            ]}
          >
            {activando ? (
              <View style={styles.filaCarga}>
                <ActivityIndicator
                  size="small"
                  color={colores.textoPrincipal}
                />

                <Text style={styles.textoBoton}>
                  Verificando...
                </Text>
              </View>
            ) : (
              <Text style={styles.textoBoton}>
                Aceptar
              </Text>
            )}
          </Pressable>

          {!!mensaje && (
            <Text
              style={styles.mensaje}
              accessibilityLiveRegion="polite"
            >
              {mensaje}
            </Text>
          )}
        </>
      )}
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    paddingBottom: 40,
    backgroundColor: colores.fondo,
  },
  titulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: colores.textoEtiqueta,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: colores.textoEtiqueta,
    marginTop: 12,
    marginBottom: 6,
  },
  parrafo: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 20,
    color: colores.textoEtiqueta,
    marginBottom: 8,
  },
  filaAceptacion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 48,
    marginTop: 28,
  },
  casilla: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colores.textoEtiqueta,
    alignItems: "center",
    justifyContent: "center",
  },
  casillaActiva: {
    backgroundColor: colores.acento,
    borderColor: colores.acento,
  },
  textoAceptacion: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    lineHeight: 18,
    color: colores.textoEtiqueta,
  },
  boton: {
    alignSelf: "center",
    minWidth: 170,
    minHeight: 44,
    borderRadius: 24,
    backgroundColor: colores.acento,
    paddingHorizontal: 24,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  textoBoton: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: colores.textoPrincipal,
    textAlign: "center",
  },
  filaCarga: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  deshabilitado: {
    opacity: 0.4,
  },
  presionado: {
    opacity: 0.75,
  },
  mensaje: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 20,
    color: colores.textoEtiqueta,
    textAlign: "center",
    marginTop: 18,
  },
  exito: {
    alignItems: "center",
    paddingTop: 40,
  },
  circuloExito: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colores.acento,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  descripcionExito: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 21,
    color: colores.textoEtiqueta,
    textAlign: "center",
  },
});