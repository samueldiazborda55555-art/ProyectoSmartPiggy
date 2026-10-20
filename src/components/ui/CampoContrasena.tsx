// src/componentes/ui/CampoContrasena.tsx
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colores } from "../../constants/colores";
import { espaciado, radios } from "../../constants/espaciado";
import { tipografia } from "../../constants/tipografia";

type Props = {
  etiqueta: string;
  valor: string;
  onCambiar: (texto: string) => void;
  error?: string;
  placeholder?: string;
};

export default function CampoContrasena({
  etiqueta,
  valor,
  onCambiar,
  error,
  placeholder,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <View style={[styles.campo, !!error && styles.campoConError]}>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={onCambiar}
          secureTextEntry={!visible}
          placeholder={placeholder}
          placeholderTextColor={colores.textoSecundario}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setVisible((v) => !v)} hitSlop={10}>
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={colores.textoPrincipal}
          />
        </TouchableOpacity>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",
    marginBottom: espaciado.md,
  },
  etiqueta: {
    ...tipografia.etiqueta,
    color: colores.textoPrincipal,
    marginBottom: espaciado.xs + 2,
  },
  campo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colores.fondoClaro,
    borderRadius: radios.campo,
    paddingHorizontal: espaciado.md,
    paddingVertical: 14,
  },
  campoConError: {
    borderWidth: 1,
    borderColor: colores.error,
  },
  input: {
    flex: 1,
    ...tipografia.texto,
    color: colores.textoPrincipal,
  },
  error: {
    ...tipografia.pequeno,
    color: colores.error,
    marginTop: espaciado.xs,
  },
});
