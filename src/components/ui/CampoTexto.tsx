// src/componentes/ui/CampoTexto.tsx
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";
import { colores } from "../../constants/colores";
import { espaciado, radios } from "../../constants/espaciado";
import { tipografia } from "../../constants/tipografia";

type Props = TextInputProps & {
  etiqueta: string;
  error?: string;
};

export default function CampoTexto({ etiqueta, error, style, ...resto }: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={[styles.campo, !!error && styles.campoConError, style]}
        placeholderTextColor={colores.textoSecundario}
        {...resto}
      />
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
    width: "100%",
    backgroundColor: colores.fondoClaro,
    borderRadius: radios.campo,
    paddingHorizontal: espaciado.md,
    paddingVertical: 14,
    ...tipografia.texto,
    color: colores.textoPrincipal,
  },
  campoConError: {
    borderWidth: 1,
    borderColor: colores.error,
  },
  error: {
    ...tipografia.pequeno,
    color: colores.error,
    marginTop: espaciado.xs,
  },
});
