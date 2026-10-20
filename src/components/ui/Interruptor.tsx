// src/componentes/ui/Interruptor.tsx
import { StyleSheet, Switch, Text, View } from "react-native";
import { colores } from "../../constants/colores";
import { espaciado } from "../../constants/espaciado";
import { tipografia } from "../../constants/tipografia";

type Props = {
  etiqueta: string;
  valor: boolean;
  onCambiar: (valor: boolean) => void;
};

export default function Interruptor({ etiqueta, valor, onCambiar }: Props) {
  return (
    <View style={styles.fila}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Switch
        value={valor}
        onValueChange={onCambiar}
        trackColor={{ false: colores.borde, true: colores.primario }}
        thumbColor={colores.fondoClaro}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: espaciado.sm,
  },
  etiqueta: {
    ...tipografia.texto,
    color: colores.textoPrincipal,
  },
});
