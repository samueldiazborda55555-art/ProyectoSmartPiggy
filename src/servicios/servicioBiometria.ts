import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";

const CLAVE = "@smartpiggy/biometria-dispositivo/v1";

export async function obtenerBiometriaActiva(): Promise<boolean> {
  return (await AsyncStorage.getItem(CLAVE)) === "true";
}

export async function activarBiometria(): Promise<boolean> {
  const tieneSensor = await LocalAuthentication.hasHardwareAsync();

  if (!tieneSensor) {
    throw new Error(
      "Este dispositivo no tiene biometría disponible."
    );
  }

  const tieneRegistro = await LocalAuthentication.isEnrolledAsync();

  if (!tieneRegistro) {
    throw new Error(
      "Configura primero una huella o reconocimiento facial en los ajustes del teléfono."
    );
  }

  const resultado = await LocalAuthentication.authenticateAsync({
    promptMessage: "Confirma tu identidad para activar la biometría",
    cancelLabel: "Cancelar",
    disableDeviceFallback: true,
    fallbackLabel: "",
  });

  if (!resultado.success) {
    const cancelaciones = [
      "user_cancel",
      "system_cancel",
      "app_cancel",
      "user_fallback",
    ];

    if (cancelaciones.includes(resultado.error)) {
      return false;
    }

    if (resultado.error === "lockout") {
      throw new Error(
        "La biometría está bloqueada temporalmente. Desbloquea el teléfono e inténtalo nuevamente."
      );
    }

    throw new Error(
      "No se pudo verificar tu identidad. Inténtalo nuevamente."
    );
  }

  // Solo se guarda después de una verificación exitosa.
  await AsyncStorage.setItem(CLAVE, "true");

  return true;
}

export async function desactivarBiometria(): Promise<void> {
  await AsyncStorage.removeItem(CLAVE);
}