import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import { colores } from "@/constants/colores";

type CampoPinProps = {
  etiqueta: string;
  valor: string;
  onCambiar: (valor: string) => void;
  error?: string;
};

function CampoPin({
  etiqueta,
  valor,
  onCambiar,
  error,
}: CampoPinProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.grupo}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>

      <View style={[styles.campo, !!error && styles.campoError]}>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={(texto) =>
            onCambiar(texto.replace(/\D/g, "").slice(0, 4))
          }
          keyboardType="number-pad"
          secureTextEntry={!visible}
          maxLength={4}
          placeholder="••••"
          placeholderTextColor={colores.textoSecundario}
          accessibilityLabel={etiqueta}
        />

        <Pressable
          onPress={() => setVisible(!visible)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={visible ? "Ocultar PIN" : "Mostrar PIN"}
        >
          <Ionicons
            name={visible ? "eye-outline" : "eye-off-outline"}
            size={21}
            color={colores.textoEtiqueta}
          />
        </Pressable>
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export default function CambiarPin() {
  const [modo, setModo] = useState<"crear" | "cambiar">("crear");
  const [pinActual, setPinActual] = useState("");
  const [nuevoPin, setNuevoPin] = useState("");
  const [confirmacion, setConfirmacion] = useState("");

  const [errores, setErrores] = useState<{
    actual?: string;
    nuevo?: string;
    confirmacion?: string;
  }>({});

  function cambiarModo(nuevoModo: "crear" | "cambiar") {
    setModo(nuevoModo);
    setPinActual("");
    setNuevoPin("");
    setConfirmacion("");
    setErrores({});
  }

  function continuar() {
    const nuevosErrores: typeof errores = {};

    if (modo === "cambiar" && pinActual.length !== 4) {
      nuevosErrores.actual = "Ingresa los 4 dígitos del PIN actual";
    }

    if (nuevoPin.length !== 4) {
      nuevosErrores.nuevo = "El PIN debe tener 4 dígitos";
    }

    if (confirmacion.length !== 4) {
      nuevosErrores.confirmacion = "Confirma los 4 dígitos";
    } else if (nuevoPin !== confirmacion) {
      nuevosErrores.confirmacion = "Los PIN no coinciden";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    // Pendiente para Karen o Miguel:
    // verificar el PIN actual y guardar el nuevo de forma segura.
    // Por ahora no se muestra éxito porque no se ha guardado.
  }

  return (
    <PantallaBase
      conBarra
      encabezado={
        <View style={styles.encabezado}>
          <EncabezadoPantalla
            titulo={modo === "crear" ? "Crear PIN" : "Cambiar PIN"}
          />
        </View>
      }
    >
      <Text style={styles.aviso}>
        Vista de diseño: selecciona el formulario que quieres revisar.
      </Text>

      <View style={styles.selector}>
        <Pressable
          onPress={() => cambiarModo("crear")}
          style={[
            styles.opcionModo,
            modo === "crear" && styles.modoActivo,
          ]}
        >
          <Text
            style={[
              styles.textoModo,
              modo === "crear" && styles.textoModoActivo,
            ]}
          >
            Crear PIN
          </Text>
        </Pressable>

        <Pressable
          onPress={() => cambiarModo("cambiar")}
          style={[
            styles.opcionModo,
            modo === "cambiar" && styles.modoActivo,
          ]}
        >
          <Text
            style={[
              styles.textoModo,
              modo === "cambiar" && styles.textoModoActivo,
            ]}
          >
            Cambiar PIN
          </Text>
        </Pressable>
      </View>

      {modo === "cambiar" && (
        <CampoPin
          etiqueta="PIN actual"
          valor={pinActual}
          onCambiar={setPinActual}
          error={errores.actual}
        />
      )}

      <CampoPin
        etiqueta="Nuevo PIN"
        valor={nuevoPin}
        onCambiar={setNuevoPin}
        error={errores.nuevo}
      />

      <CampoPin
        etiqueta="Confirmar PIN"
        valor={confirmacion}
        onCambiar={setConfirmacion}
        error={errores.confirmacion}
      />

      <Pressable
        onPress={continuar}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.boton,
          pressed && styles.presionado,
        ]}
      >
        <Text style={styles.textoBoton}>
          {modo === "crear" ? "Crear PIN" : "Cambiar PIN"}
        </Text>
      </Pressable>
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    paddingBottom: 56,
    backgroundColor: colores.fondo,
  },
  aviso: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: colores.textoEtiqueta,
    marginBottom: 12,
  },
  selector: {
    flexDirection: "row",
    backgroundColor: colores.gris,
    borderRadius: 22,
    padding: 4,
    marginBottom: 28,
  },
  opcionModo: {
    flex: 1,
    minHeight: 38,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  modoActivo: {
    backgroundColor: colores.acento,
  },
  textoModo: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: colores.textoPrincipal,
  },
  textoModoActivo: {
    color: colores.textoClaro,
  },
  grupo: {
    marginBottom: 28,
  },
  etiqueta: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.textoEtiqueta,
    marginBottom: 8,
  },
  campo: {
    minHeight: 44,
    backgroundColor: colores.fondoClaro,
    borderRadius: 24,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  campoError: {
    borderColor: colores.error,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    letterSpacing: 6,
    color: colores.textoPrincipal,
  },
  error: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: colores.error,
    marginTop: 6,
  },
  boton: {
    alignSelf: "center",
    backgroundColor: colores.acento,
    minWidth: 160,
    minHeight: 44,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  textoBoton: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.textoPrincipal,
  },
  presionado: {
    opacity: 0.75,
  },
});