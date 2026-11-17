import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import { DIAS_SEMANA, MESES, generarCeldas } from "@/utilidades/calendario";

type Props = {
  anio: number;
  mes: number; // 0 = enero ... 11 = diciembre
  diaSeleccionado: number | null;
  diasConMovimientos: Set<number>; // días que llevan puntito
  onCambiarMes: (mes: number) => void;
  onCambiarAnio: (anio: number) => void;
  onSeleccionarDia: (dia: number) => void;
};

export default function CalendarioMensual({
  anio,
  mes,
  diaSeleccionado,
  diasConMovimientos,
  onCambiarMes,
  onCambiarAnio,
  onSeleccionarDia,
}: Props) {
  // Qué lista desplegable está abierta: la de meses, la de años o ninguna
  const [abierto, setAbierto] = useState<"mes" | "anio" | null>(null);

  const celdas = generarCeldas(anio, mes);

  const anioActual = new Date().getFullYear();
  const anios = Array.from({ length: 7 }, (_, i) => anioActual - 5 + i); // 5 atrás y 1 adelante

  const alternar = (cual: "mes" | "anio") => setAbierto((actual) => (actual === cual ? null : cual));

  return (
    <View>
      {/* Selectores de mes y año */}
      <View style={styles.selectores}>
        <TouchableOpacity style={styles.selector} onPress={() => alternar("mes")} activeOpacity={0.7}>
          <Text style={styles.textoSelector}>{MESES[mes]}</Text>
          <Ionicons name={abierto === "mes" ? "chevron-up" : "chevron-down"} size={14} color={colores.acento} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.selector} onPress={() => alternar("anio")} activeOpacity={0.7}>
          <Text style={styles.textoSelector}>{anio}</Text>
          <Ionicons name={abierto === "anio" ? "chevron-up" : "chevron-down"} size={14} color={colores.acento} />
        </TouchableOpacity>
      </View>

      {abierto !== null && (
        <View style={styles.panel}>
          {abierto === "mes"
            ? MESES.map((nombre, i) => (
                <TouchableOpacity
                  key={nombre}
                  style={[styles.opcion, i === mes && styles.opcionActiva]}
                  onPress={() => {
                    onCambiarMes(i);
                    setAbierto(null);
                  }}
                >
                  <Text style={[styles.textoOpcion, i === mes && styles.textoOpcionActiva]}>{nombre}</Text>
                </TouchableOpacity>
              ))
            : anios.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.opcion, a === anio && styles.opcionActiva]}
                  onPress={() => {
                    onCambiarAnio(a);
                    setAbierto(null);
                  }}
                >
                  <Text style={[styles.textoOpcion, a === anio && styles.textoOpcionActiva]}>{a}</Text>
                </TouchableOpacity>
              ))}
        </View>
      )}

      {/* Días de la semana (empiezan en lunes) */}
      <View style={styles.cuadricula}>
        {DIAS_SEMANA.map((d) => (
          <View key={d} style={styles.celdaSemana}>
            <Text style={styles.textoSemana}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Cuadrícula de días */}
      <View style={styles.cuadricula}>
        {celdas.map((dia, i) =>
          dia === null ? (
            <View key={`vacio-${i}`} style={styles.celda} />
          ) : (
            <TouchableOpacity
              key={dia}
              style={styles.celda}
              activeOpacity={0.7}
              onPress={() => onSeleccionarDia(dia)}
            >
              <View style={[styles.circulo, dia === diaSeleccionado && styles.circuloActivo]}>
                <Text style={[styles.numero, dia === diaSeleccionado && styles.numeroActivo]}>{dia}</Text>
              </View>
              {diasConMovimientos.has(dia) && <View style={styles.punto} />}
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectores: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: espaciado.sm,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaciado.xs,
    paddingVertical: espaciado.xs,
  },
  textoSelector: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.acento,
  },
  panel: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espaciado.xs + 2,
    backgroundColor: colores.fondoClaro,
    borderRadius: 16,
    padding: espaciado.sm + 2,
    marginBottom: espaciado.sm,
  },
  opcion: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colores.hojaClara,
  },
  opcionActiva: {
    backgroundColor: colores.acento,
  },
  textoOpcion: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: colores.textoPrincipal,
  },
  textoOpcionActiva: {
    color: colores.textoClaro,
  },
  cuadricula: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  celdaSemana: {
    width: "14.2857%",
    alignItems: "center",
    paddingBottom: espaciado.xs,
  },
  textoSemana: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: colores.acento,
  },
  celda: {
    width: "14.2857%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  circulo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  circuloActivo: {
    backgroundColor: colores.acento,
  },
  numero: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: colores.textoPrincipal,
  },
  numeroActivo: {
    fontFamily: "Poppins_600SemiBold",
    color: colores.textoClaro,
  },
  punto: {
    position: "absolute",
    bottom: 1,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colores.azul,
  },
});