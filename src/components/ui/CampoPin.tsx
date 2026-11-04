import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colores } from "@/constants/colores";
import { tipografia } from "@/constants/tipografia";

type Props = {
  longitud?: number;
  valor: string;
  onCambiar: (valor: string) => void;
};

// Un TextInput oculto recibe lo que se escribe; los círculos solo lo muestran.
export default function CampoPin({ longitud = 6, valor, onCambiar }: Props) {
  const inputRef = useRef<TextInput>(null);
  const digitos = Array.from({ length: longitud }, (_, i) => valor[i] ?? "");

  return (
    <View>
      <Pressable style={styles.fila} onPress={() => inputRef.current?.focus()}>
        {digitos.map((digito, i) => (
          <View key={i} style={styles.circulo}>
            <Text style={styles.digito}>{digito}</Text>
          </View>
        ))}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={valor}
        onChangeText={(t) => onCambiar(t.replace(/[^0-9]/g, "").slice(0, longitud))}
        keyboardType="number-pad"
        maxLength={longitud}
        style={styles.inputOculto}
        autoFocus
      />
    </View>
  );
}

const TAMANO = 40;

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  circulo: {
    width: TAMANO,
    height: TAMANO,
    borderRadius: TAMANO / 2,
    borderWidth: 2,
    borderColor: colores.textoPrincipal,
    alignItems: "center",
    justifyContent: "center",
  },
  digito: {
    ...tipografia.etiqueta,
    color: colores.textoEtiqueta,
  },
  inputOculto: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});