import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import EncabezadoPantalla from "@/components/disposicion/EncabezadoPantalla";
import PantallaBase from "@/components/disposicion/PantallaBase";
import CalendarioMensual from "@/components/finanzas/CalendarioMensual";
import GraficoCircularCategorias from "@/components/finanzas/GraficoCircularCategorias";
import ListaMovimientos from "@/components/finanzas/ListaMovimientos";
import { colores } from "@/constants/colores";
import { espaciado } from "@/constants/espaciado";
import { tipografia } from "@/constants/tipografia";
import { useMovimientos } from "@/hooks/useMovimientos";
import { diasConMovimientos, movimientosDelDia } from "@/utilidades/calendario";

type Vista = "gastos" | "categorias";

export default function Calendario() {
  const { movimientos } = useMovimientos();

  const hoy = new Date();
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth());
  const [dia, setDia] = useState<number | null>(hoy.getDate());
  const [vista, setVista] = useState<Vista>("gastos");

  const diasMarcados = diasConMovimientos(movimientos, anio, mes);
  const delDia = dia !== null ? movimientosDelDia(movimientos, anio, mes, dia) : [];

  // Al cambiar de mes o de año se quita el día elegido (el nuevo mes puede tener menos días)
  const cambiarMes = (nuevoMes: number) => {
    setMes(nuevoMes);
    setDia(null);
  };
  const cambiarAnio = (nuevoAnio: number) => {
    setAnio(nuevoAnio);
    setDia(null);
  };

  return (
    <PantallaBase conBarra encabezado={<EncabezadoPantalla titulo="Calendario" />}>
      <CalendarioMensual
        anio={anio}
        mes={mes}
        diaSeleccionado={dia}
        diasConMovimientos={diasMarcados}
        onCambiarMes={cambiarMes}
        onCambiarAnio={cambiarAnio}
        onSeleccionarDia={setDia}
      />

      {/* Botones Gastos / Categorías */}
      <View style={styles.botones}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.boton, vista === "gastos" && styles.botonActivo]}
          onPress={() => setVista("gastos")}
        >
          <Text style={[styles.textoBoton, vista === "gastos" && styles.textoBotonActivo]}>Gastos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.boton, vista === "categorias" && styles.botonActivo]}
          onPress={() => setVista("categorias")}
        >
          <Text style={[styles.textoBoton, vista === "categorias" && styles.textoBotonActivo]}>Categorías</Text>
        </TouchableOpacity>
      </View>

      {vista === "gastos" ? (
        dia === null ? (
          <Text style={styles.mensaje}>Elige un día para ver sus movimientos</Text>
        ) : delDia.length === 0 ? (
          <Text style={styles.mensaje}>No hay movimientos este día</Text>
        ) : (
          <ListaMovimientos movimientos={delDia} variante="azul" agruparPorMes={false} />
        )
      ) : (
        <View style={styles.pastel}>
          <GraficoCircularCategorias movimientos={movimientos} fecha={new Date(anio, mes, 1)} />
        </View>
      )}
    </PantallaBase>
  );
}

const styles = StyleSheet.create({
  botones: {
    flexDirection: "row",
    gap: espaciado.md,
    marginTop: espaciado.md,
    marginBottom: espaciado.md,
  },
  boton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: espaciado.xs + 3,
    borderRadius: 16,
    backgroundColor: colores.fondoClaro,
  },
  botonActivo: {
    backgroundColor: colores.acento,
  },
  textoBoton: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: colores.textoPrincipal,
  },
  textoBotonActivo: {
    color: colores.textoClaro,
  },
  mensaje: {
    ...tipografia.texto,
    color: colores.textoSecundario,
    textAlign: "center",
    marginTop: espaciado.lg,
  },
  pastel: {
    marginTop: espaciado.sm,
  },
});