// src/componentes/ui/CampoPin.tsx
import { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colores } from "../../constants/colores";
import { tipografia } from "../../constants/tipografia";

type Props = {
  longitud?: number;
  valor: string;
  onCambiar: (valor: string) => void;
};

// Un solo TextInput oculto recibe el número real; los círculos
// visibles solo muestran si hay dígito o no en cada posición.
export default function CampoPin({ longitud = 6, valor, onCambiar }: Props) {
  const inputRef = useRef<TextInput>(null);
  const digitos = Array.from({ length: longitud }, (_, i) => valor[i] ?? "");

  return (
    <View style={styles.contenedor} onTouchEnd={() => inputRef.current?.focus()}>
      {digitos.map((digito, i) => (
        <View key={i} style={[styles.circulo, digito !== "" && styles.circuloLleno]} />
      ))}
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

const TAMANO = 44;

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  circulo: {
    width: TAMANO,
    height: TAMANO,
    borderRadius: TAMANO / 2,
    borderWidth: 1.5,
    borderColor: colores.textoPrincipal,
    alignItems: "center",
    justifyContent: "center",
  },
  circuloLleno: {
    backgroundColor: colores.hojaClara,
    borderColor: colores.acento,
  },
  inputOculto: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
    ...tipografia.texto,
  },
});
