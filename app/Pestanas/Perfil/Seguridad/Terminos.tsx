import { StyleSheet, Text, View } from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import { colores } from "@/constants/colores";

const SECCIONES = [
  {
    titulo: "Uso de SmartPiggy",
    texto:
      "SmartPiggy permite registrar ingresos, gastos y metas de ahorro para organizar tus finanzas personales.",
  },
  {
    titulo: "Información registrada",
    texto:
      "Los resúmenes dependen de los datos que registres. Revisa que los montos, las fechas y las categorías sean correctos.",
  },
  {
    titulo: "Seguridad de la cuenta",
    texto:
      "Mantén tu contraseña y tu PIN privados. Si compartes el teléfono, revisa quién puede acceder a la aplicación.",
  },
  {
    titulo: "Preferencias",
    texto:
      "Desde Perfil podrás consultar las opciones de seguridad y configuración disponibles.",
  },
];

export default function TerminosGenerales() {
  return (
    <PantallaBase
      conBarra
      encabezado={
        <View style={styles.encabezado}>
          <EncabezadoPantalla titulo="Términos y condiciones" />
        </View>
      }
    >
      <Text style={styles.titulo}>
        Términos y condiciones
      </Text>

      {SECCIONES.map((seccion) => (
        <View key={seccion.titulo} style={styles.seccion}>
          <Text style={styles.subtitulo}>
            {seccion.titulo}
          </Text>

          <Text style={styles.parrafo}>
            {seccion.texto}
          </Text>
        </View>
      ))}
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    paddingBottom: 40,
    backgroundColor: colores.fondo,
  },
  titulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 19,
    color: colores.textoEtiqueta,
    marginBottom: 12,
  },
  borrador: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: colores.textoEtiqueta,
    marginBottom: 24,
  },
  seccion: {
    marginBottom: 22,
  },
  subtitulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: colores.textoEtiqueta,
    marginBottom: 7,
  },
  parrafo: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 21,
    color: colores.textoEtiqueta,
  },
});