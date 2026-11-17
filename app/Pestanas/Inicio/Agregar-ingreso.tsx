import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import { colores } from "@/constants/colores";

function fechaActual() {
  const hoy = new Date();

  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");

  return `${dia}/${mes}/${hoy.getFullYear()}`;
}

export default function AgregarIngreso() {
  const [fecha, setFecha] = useState(fechaActual);
  const [monto, setMonto] = useState("");
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");

  return (
    <PantallaBase
      conBarra
      encabezado={
        <EncabezadoPantalla titulo="Agregar ingresos" />
      }
    >
      <View style={styles.formulario}>
        <View style={styles.grupo}>
          <Text style={styles.etiqueta}>Fecha</Text>

          <View style={styles.campoConIcono}>
            <TextInput
              style={styles.inputConIcono}
              value={fecha}
              onChangeText={setFecha}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={colores.textoSecundario}
              keyboardType="numbers-and-punctuation"
              maxLength={10}
              accessibilityLabel="Fecha del ingreso"
            />

            <View style={styles.iconoCalendario}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={colores.textoClaro}
              />
            </View>
          </View>
        </View>

        <View style={styles.grupo}>
          <Text style={styles.etiqueta}>Categoría</Text>

          <View style={styles.categoria}>
            <Text style={styles.textoCategoria}>Ingresos</Text>
          </View>
        </View>

        <View style={styles.grupo}>
          <Text style={styles.etiqueta}>Monto</Text>

          <TextInput
            style={styles.input}
            value={monto}
            onChangeText={setMonto}
            placeholder="$0,00"
            placeholderTextColor={colores.textoSecundario}
            keyboardType="decimal-pad"
            accessibilityLabel="Monto del ingreso"
          />
        </View>

        <View style={styles.grupo}>
          <Text style={styles.etiqueta}>Nombre del ingreso</Text>

          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Quincena"
            placeholderTextColor={colores.textoSecundario}
            autoCapitalize="sentences"
            accessibilityLabel="Nombre del ingreso"
          />
        </View>

        <TextInput
          style={styles.mensaje}
          value={mensaje}
          onChangeText={setMensaje}
          placeholder="Introducir mensaje"
          placeholderTextColor={colores.textoPrincipal}
          multiline
          textAlignVertical="top"
          accessibilityLabel="Mensaje opcional"
        />

        <View style={styles.contenedorGuardar}>
          <Text
            accessibilityRole="button"
            onPress={() => // Pendiente: conectar el guardado con el backend.
              Alert.alert(
                "Vista de diseño",
                "El formulario todavía no guarda ingresos."
              )
            }
            style={styles.botonGuardar}
          >
            Guardar
          </Text>
        </View>
      </View>
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  formulario: {
    width: "100%",
    paddingTop: 8,
  },
  grupo: {
    marginBottom: 24,
  },
  etiqueta: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.textoEtiqueta,
    marginBottom: 6,
    marginLeft: 6,
  },
  input: {
    minHeight: 42,
    backgroundColor: colores.fondoClaro,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: colores.textoPrincipal,
  },
  campoConIcono: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colores.fondoClaro,
    borderRadius: 22,
    paddingLeft: 14,
    paddingRight: 10,
  },
  inputConIcono: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: colores.textoPrincipal,
  },
  iconoCalendario: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: colores.acento,
    alignItems: "center",
    justifyContent: "center",
  },
  categoria: {
    minHeight: 42,
    justifyContent: "center",
    backgroundColor: colores.fondoClaro,
    borderRadius: 22,
    paddingHorizontal: 14,
  },
  textoCategoria: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: colores.textoSecundario,
  },
  mensaje: {
    height: 150,
    backgroundColor: colores.fondoClaro,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: colores.textoPrincipal,
  },
  contenedorGuardar: {
    alignItems: "center",
    marginTop: 28,
  },
  botonGuardar: {
    overflow: "hidden",
    backgroundColor: colores.acento,
    borderRadius: 22,
    paddingHorizontal: 44,
    paddingVertical: 11,
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.textoPrincipal,
    textAlign: "center",
  },
});