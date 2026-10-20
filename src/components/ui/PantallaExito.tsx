// src/componentes/ui/PantallaExito.tsx
import { StyleSheet, Text, View } from "react-native";
import { colores } from "../../constants/colores";
import { espaciado } from "../../constants/espaciado";
import { tipografia } from "../../constants/tipografia";

type Props = {
  mensaje: string;
};

// Reemplaza las 5 pantallas casi idénticas del Figma:
// "La contraseña/El PIN/La huella digital se ha cambiado/eliminado
// correctamente." Solo cambia el texto que recibe.
export default function PantallaExito({ mensaje }: Props) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.circulo}>
        <View style={styles.punto} />
      </View>
      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
}

const TAMANO_CIRCULO = 90;

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondoOscuro,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espaciado.xl,
  },
  circulo: {
    width: TAMANO_CIRCULO,
    height: TAMANO_CIRCULO,
    borderRadius: TAMANO_CIRCULO / 2,
    borderWidth: 3,
    borderColor: colores.hojaClara,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: espaciado.lg,
  },
  punto: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colores.hojaClara,
  },
  mensaje: {
    ...tipografia.subtitulo,
    color: colores.hojaClara,
    textAlign: "center",
  },
});
