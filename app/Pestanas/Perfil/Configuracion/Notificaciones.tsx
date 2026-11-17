import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import { colores } from "@/constants/colores";

const CLAVE = "@smartpiggy/preferencias-notificaciones/v1";

const INICIALES = {
  general: true,
  sonido: true,
  llamada: true,
  vibrar: true,
  transacciones: false,
  recordatorios: false,
  presupuesto: false,
  saldoBajo: false,
};

type Preferencias = typeof INICIALES;
type ClavePreferencia = keyof Preferencias;

const OPCIONES: {
  clave: ClavePreferencia;
  etiqueta: string;
}[] = [
  { clave: "general", etiqueta: "Notificación general" },
  { clave: "sonido", etiqueta: "Sonido" },
  { clave: "llamada", etiqueta: "Llamada de sonido" },
  { clave: "vibrar", etiqueta: "Vibrar" },
  {
    clave: "transacciones",
    etiqueta: "Actualización de transacciones",
  },
  {
    clave: "recordatorios",
    etiqueta: "Recordatorio de gastos",
  },
  {
    clave: "presupuesto",
    etiqueta: "Notificaciones de presupuesto",
  },
  {
    clave: "saldoBajo",
    etiqueta: "Alertas de saldo bajo",
  },
];

// Mantiene el orden de escritura aunque se cambien varios interruptores.
let colaGuardado: Promise<void> = Promise.resolve();

function guardarPreferencias(preferencias: Preferencias) {
  const texto = JSON.stringify(preferencias);

  const escritura = colaGuardado
    .catch(() => undefined)
    .then(() => AsyncStorage.setItem(CLAVE, texto));

  colaGuardado = escritura;
  return escritura;
}

export default function NotificacionesConfiguracion() {
  const [preferencias, setPreferencias] =
    useState<Preferencias>(INICIALES);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarPreferencias() {
      try {
        // Espera cualquier guardado pendiente de esta pantalla.
        await colaGuardado.catch(() => undefined);

        const texto = await AsyncStorage.getItem(CLAVE);

        if (texto) {
          const datos: unknown = JSON.parse(texto);

          if (
            typeof datos !== "object" ||
            datos === null ||
            Array.isArray(datos)
          ) {
            throw new Error("Formato de preferencias inválido");
          }

          const guardadas = datos as Record<string, unknown>;
          const siguientes: Preferencias = { ...INICIALES };

          for (const { clave } of OPCIONES) {
            if (typeof guardadas[clave] === "boolean") {
              siguientes[clave] = guardadas[clave];
            }
          }

          if (!siguientes.general) {
            for (const { clave } of OPCIONES) {
              siguientes[clave] = false;
            }
          }

          if (activo) setPreferencias(siguientes);
        }
      } catch {
        if (activo) {
          setError(
            "No se pudieron cargar las preferencias. Puedes volver a configurarlas."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargarPreferencias();

    return () => {
      activo = false;
    };
  }, []);

  async function cambiar(
    clave: ClavePreferencia,
    valor: boolean
  ) {
    if (cargando || guardando) return;
    if (clave !== "general" && !preferencias.general) return;

    const anteriores = preferencias;
    const siguientes = {
      ...preferencias,
      [clave]: valor,
    };

    if (clave === "general" && !valor) {
      for (const { clave: otraClave } of OPCIONES) {
        siguientes[otraClave] = false;
      }
    }

    setPreferencias(siguientes);
    setError(null);
    setGuardando(true);

    try {
      await guardarPreferencias(siguientes);
    } catch {
      setPreferencias(anteriores);
      setError(
        "No se pudo guardar el cambio. Inténtalo de nuevo."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <PantallaBase
      conBarra
      encabezado={
        <View style={styles.encabezado}>
          <EncabezadoPantalla titulo="Notificaciones" />
        </View>
      }
    >
      {cargando ? (
        <ActivityIndicator
          size="large"
          color={colores.acento}
          style={styles.carga}
        />
      ) : (
        <View style={styles.lista}>
          {OPCIONES.map(({ clave, etiqueta }) => {
            const bloqueado =
              clave !== "general" && !preferencias.general;

            return (
              <View
                key={clave}
                style={[
                  styles.fila,
                  bloqueado && styles.bloqueado,
                ]}
              >
                <Text style={styles.etiqueta}>
                  {etiqueta}
                </Text>

                <Switch
                  value={preferencias[clave]}
                  onValueChange={(valor) => {
                    void cambiar(clave, valor);
                  }}
                  disabled={bloqueado || guardando}
                  trackColor={{
                    false: colores.mentaApagada,
                    true: colores.menta,
                  }}
                  thumbColor={colores.fondoClaro}
                  accessibilityLabel={etiqueta}
                />
              </View>
            );
          })}

          {!!error && (
            <Text
              style={styles.error}
              accessibilityLiveRegion="polite"
            >
              {error}
            </Text>
          )}
        </View>
      )}
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    backgroundColor: colores.fondo,
    paddingBottom: 56,
  },
  carga: {
    marginTop: 32,
  },
  lista: {
    paddingTop: 4,
    gap: 10,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
    gap: 12,
  },
  etiqueta: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: colores.textoEtiqueta,
  },
  bloqueado: {
    opacity: 0.45,
  },
  error: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: colores.error,
    marginTop: 16,
  },
});