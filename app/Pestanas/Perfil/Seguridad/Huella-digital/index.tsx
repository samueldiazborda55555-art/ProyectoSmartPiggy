import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import ModalConfirmacion from "@/components/ui/ModalConfirmacion";
import { colores } from "@/constants/colores";
import {
  desactivarBiometria,
  obtenerBiometriaActiva,
} from "@/servicios/servicioBiometria";

export default function AccesoBiometrico() {
  const [activa, setActiva] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let montada = true;

      async function cargarEstado() {
        setCargando(true);
        setError("");

        try {
          const valor = await obtenerBiometriaActiva();

          if (montada) setActiva(valor);
        } catch {
          if (montada) {
            setError("No se pudo consultar la configuración.");
          }
        } finally {
          if (montada) setCargando(false);
        }
      }

      void cargarEstado();

      return () => {
        montada = false;
      };
    }, [])
  );

  async function confirmarDesactivacion() {
    if (procesando) return;

    setProcesando(true);
    setError("");

    try {
      await desactivarBiometria();
      setActiva(false);
      setMostrarModal(false);
    } catch {
      setMostrarModal(false);
      setError("No se pudo desactivar. Inténtalo nuevamente.");
    } finally {
      setProcesando(false);
    }
  }

  return (
    <>
      <PantallaBase
        conBarra
        encabezado={
          <View style={styles.encabezado}>
            <EncabezadoPantalla titulo="Acceso biométrico" />
          </View>
        }
      >
        {cargando ? (
          <ActivityIndicator
            size="large"
            color={colores.acento}
          />
        ) : (
          <>
            <View style={styles.estado}>
              <View style={styles.iconoEstado}>
                <Ionicons
                  name="finger-print-outline"
                  size={30}
                  color={colores.textoClaro}
                />
              </View>

              <View style={styles.textosEstado}>
                <Text style={styles.tituloEstado}>
                  Acceso con biometría
                </Text>

                <Text style={styles.descripcion}>
                  {activa
                    ? "Activado en este dispositivo"
                    : "Desactivado"}
                </Text>
              </View>
            </View>

            {!error && (
              <TouchableOpacity
                style={styles.opcion}
                activeOpacity={0.7}
                disabled={procesando}
                onPress={() => {
                  if (activa) {
                    setMostrarModal(true);
                  } else {
                    router.push(
                      "/Pestanas/Perfil/Seguridad/Huella-digital/Agregar"
                    );
                  }
                }}
                accessibilityRole="button"
              >
                <View style={styles.iconoAccion}>
                  <Ionicons
                    name={activa ? "remove-outline" : "add"}
                    size={28}
                    color={colores.textoClaro}
                  />
                </View>

                <Text style={styles.textoOpcion}>
                  {procesando
                    ? "Desactivando..."
                    : activa
                      ? "Desactivar acceso biométrico"
                      : "Configurar acceso biométrico"}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={21}
                  color={colores.textoEtiqueta}
                />
              </TouchableOpacity>
            )}

            {!!error && (
              <Text
                style={styles.error}
                accessibilityLiveRegion="polite"
              >
                {error}
              </Text>
            )}
          </>
        )}
      </PantallaBase>

      <ModalConfirmacion
        visible={mostrarModal}
        titulo="Desactivar biometría"
        mensaje="¿Quieres desactivar el acceso biométrico en SmartPiggy? Las huellas del teléfono no se eliminarán."
        textoConfirmar={
          procesando ? "Desactivando..." : "Sí, desactivar"
        }
        onConfirmar={() => {
          void confirmarDesactivacion();
        }}
        onCancelar={() => {
          if (!procesando) setMostrarModal(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    paddingBottom: 56,
    backgroundColor: colores.fondo,
  },
  estado: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 8,
    marginBottom: 28,
  },
  iconoEstado: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: colores.azulClaro,
    alignItems: "center",
    justifyContent: "center",
  },
  textosEstado: {
    flex: 1,
  },
  tituloEstado: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.textoEtiqueta,
  },
  descripcion: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: colores.textoEtiqueta,
    marginTop: 3,
  },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 60,
  },
  iconoAccion: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: colores.azulMedio,
    alignItems: "center",
    justifyContent: "center",
  },
  textoOpcion: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: colores.textoEtiqueta,
  },
  error: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 20,
    color: colores.error,
    marginTop: 16,
  },
});