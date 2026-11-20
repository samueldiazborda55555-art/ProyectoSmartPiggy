import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FichaCategoria from "@/components/finanzas/FichaCategoria";
import PresupuestoMensual from "@/components/finanzas/PresupuestoMensual";
import ResumenSaldo from "@/components/finanzas/ResumenSaldo";
import { CATEGORIAS } from "@/constants/categorias";
import { colores } from "@/constants/colores";
import { medidas } from "@/constants/espaciado";
import { useMovimientos } from "@/hooks/useMovimientos";
import type { Categoria } from "@/tipos/categoria";
import { calcularResumen } from "@/utilidades/resumenFinanciero";

export default function PantallaCategorias() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Los mismos datos que utiliza Inicio.
  const { movimientos } = useMovimientos();
  const resumen = calcularResumen(movimientos);

  const [modalVisible, setModalVisible] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [errorCategoria, setErrorCategoria] = useState("");

  // Categorías temporales hasta conectarlas con Firestore.
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS);

  function cerrarModal() {
    setModalVisible(false);
    setNombreNuevo("");
    setErrorCategoria("");
  }

  function abrirModal() {
    setNombreNuevo("");
    setErrorCategoria("");
    setModalVisible(true);
  }

  function guardarCategoria() {
    const nombre = nombreNuevo.trim();

    if (!nombre) {
      setErrorCategoria("Escribe el nombre de la categoría");
      return;
    }

    const yaExiste = categorias.some(
      (categoria) =>
        categoria.nombre.trim().toLowerCase() === nombre.toLowerCase(),
    );

    if (yaExiste) {
      setErrorCategoria("Ya existe una categoría con ese nombre");
      return;
    }

    const nueva: Categoria = {
      id: "personalizada",
      nombre,
      icono: "personalizada",
    };

    setCategorias((actuales) => {
      const sinMas = actuales.filter((categoria) => categoria.id !== "mas");

      const mas = actuales.filter((categoria) => categoria.id === "mas");

      return [...sinMas, nueva, ...mas];
    });

    cerrarModal();
  }

  return (
    <View style={styles.fondo}>
      <View style={styles.pantalla}>
        <View style={[styles.encabezado, { paddingTop: insets.top + 16 }]}>
          <View style={styles.barraTitulo}>
            <Pressable
              style={styles.lado}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/Pestanas/Inicio");
                }
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Volver"
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={colores.textoPrincipal}
              />
            </Pressable>

            <Text style={styles.titulo}>Categorías</Text>

            <Pressable
              style={styles.ladoDerecho}
              onPress={() => router.push("/Notificaciones")}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Ver notificaciones"
            >
              <View style={styles.campana}>
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={colores.textoEtiqueta}
                />
              </View>
            </Pressable>
          </View>

          <View style={styles.resumen}>
            <ResumenSaldo
              saldoTotal={resumen.saldo}
              gastoTotal={resumen.gastoTotal}
            />
          </View>

          {/* Mismo presupuesto general y mismos gastos que Inicio. */}
          <PresupuestoMensual movimientos={movimientos} />
        </View>

        <ScrollView
          style={styles.hoja}
          contentContainerStyle={[
            styles.cuadricula,
            {
              paddingBottom: medidas.alturaBarra + insets.bottom + 24,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {categorias.map((categoria, indice) => (
            <View key={`${categoria.id}-${indice}`} style={styles.celda}>
              <FichaCategoria
                categoria={categoria}
                seleccionada={categoria.id === "comida"}
                alPresionar={
                  categoria.id === "mas"
                    ? abrirModal
                    : categoria.id === "ahorros"
                      ? () => router.push("/Pestanas/Categorias/Ahorros")
                      : categoria.id === "personalizada"
                        ? () => {
                            // Pendiente: detalle de categoría personalizada.
                          }
                        : undefined
                }
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={cerrarModal}
      >
        <KeyboardAvoidingView
          style={styles.fondoModal}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.tarjetaModal} accessibilityViewIsModal>
            <Text style={styles.tituloModal}>Nueva categoría</Text>

            <TextInput
              style={[styles.campo, !!errorCategoria && styles.campoError]}
              placeholder="Nombre de la categoría"
              placeholderTextColor={colores.textoSecundario}
              value={nombreNuevo}
              onChangeText={(texto) => {
                setNombreNuevo(texto);
                setErrorCategoria("");
              }}
              onSubmitEditing={guardarCategoria}
              autoFocus
              autoCapitalize="sentences"
              maxLength={40}
              accessibilityLabel="Nombre de la categoría"
            />

            {!!errorCategoria && (
              <Text style={styles.error} accessibilityLiveRegion="polite">
                {errorCategoria}
              </Text>
            )}

            <View style={styles.botones}>
              <Pressable
                style={styles.botonCancelar}
                onPress={cerrarModal}
                accessibilityRole="button"
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.botonGuardar}
                onPress={guardarCategoria}
                accessibilityRole="button"
              >
                <Text style={styles.textoGuardar}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colores.fondo,
    alignItems: "center",
  },
  pantalla: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
  },
  encabezado: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  barraTitulo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 40,
  },
  lado: {
    width: 34,
    height: 34,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  ladoDerecho: {
    width: 34,
    height: 34,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  titulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: colores.textoPrincipal,
  },
  campana: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colores.mentaClara,
    alignItems: "center",
    justifyContent: "center",
  },
  resumen: {
    marginTop: 4,
  },
  hoja: {
    flex: 1,
    backgroundColor: colores.hojaClara,
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
  },
  cuadricula: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 36,
  },
  celda: {
    width: "33.33%",
    alignItems: "center",
    marginBottom: 28,
  },
  fondoModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  tarjetaModal: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colores.fondoClaro,
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  tituloModal: {
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    color: colores.textoPrincipal,
    textAlign: "center",
  },
  campo: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    padding: 12,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: colores.textoPrincipal,
  },
  campoError: {
    borderColor: colores.error,
  },
  error: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: colores.error,
  },
  botones: {
    flexDirection: "row",
    gap: 12,
  },
  botonCancelar: {
    flex: 1,
    minHeight: 44,
    padding: 12,
    borderRadius: 24,
    backgroundColor: colores.mentaClara,
    alignItems: "center",
    justifyContent: "center",
  },
  textoCancelar: {
    fontFamily: "Poppins_400Regular",
    color: colores.textoPrincipal,
  },
  botonGuardar: {
    flex: 1,
    minHeight: 44,
    padding: 12,
    borderRadius: 24,
    backgroundColor: colores.menta,
    alignItems: "center",
    justifyContent: "center",
  },
  textoGuardar: {
    fontFamily: "Poppins_500Medium",
    color: colores.textoClaro,
  },
});
