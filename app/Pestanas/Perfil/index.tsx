import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PantallaBase from "@/components/disposicion/PantallaBase";
import ModalConfirmacion from "@/components/ui/ModalConfirmacion";
import { colores } from "@/constants/colores";

type NombreIcono = React.ComponentProps<typeof Ionicons>["name"];

type OpcionPerfilProps = {
  icono: NombreIcono;
  texto: string;
  color: string;
  onPress: () => void;
};

function OpcionPerfil({
  icono,
  texto,
  color,
  onPress,
}: OpcionPerfilProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.opcion,
        pressed && styles.presionado,
      ]}
    >
      <View
        style={[
          styles.iconoOpcion,
          { backgroundColor: color },
        ]}
      >
        <Ionicons
          name={icono}
          size={27}
          color={colores.textoClaro}
        />
      </View>

      <Text style={styles.textoOpcion}>{texto}</Text>
    </Pressable>
  );
}

export default function Perfil() {
  const insets = useSafeAreaInsets();
  const [mostrarCierre, setMostrarCierre] = useState(false);

  // Datos de ejemplo para revisar el diseño.
  const nombre = "Sara Culma";
  const identificador = "25030024";

  function confirmarCierre() {
    setMostrarCierre(false);

    // Pendiente para Karen:
    // conectar aquí el cierre de sesión real.
  }

  return (
    <View style={styles.contenedor}>
      <PantallaBase
        conBarra
        encabezado={
          <View
            style={[
              styles.encabezado,
              { paddingTop: insets.top + 16 },
            ]}
          >
            <View style={styles.filaEncabezado}>
              <Pressable
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace("/Pestanas/Inicio");
                  }
                }}
                style={styles.botonEncabezado}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Volver"
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colores.textoPrincipal}
                />
              </Pressable>

              <Text style={styles.titulo}>Perfil</Text>

              <Pressable
                onPress={() => router.push("/Notificaciones")}
                style={styles.campana}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Ver notificaciones"
              >
                <Ionicons
                  name="notifications-outline"
                  size={19}
                  color={colores.textoEtiqueta}
                />
              </Pressable>
            </View>
          </View>
        }
      >
        <View style={styles.datosPerfil}>
          <Text style={styles.nombre}>{nombre}</Text>

          <Text style={styles.identificador}>
            <Text style={styles.etiquetaId}>ID: </Text>
            {identificador}
          </Text>
        </View>

        <View style={styles.opciones}>
          <OpcionPerfil
            icono="person-outline"
            texto="Editar perfil"
            color={colores.azulClaro}
            onPress={() => router.push("/Pestanas/Perfil/Editar")}
          />

          <OpcionPerfil
            icono="shield-checkmark-outline"
            texto="Seguridad"
            color={colores.azulMedio}
            onPress={() => router.push("/Pestanas/Perfil/Seguridad")}
          />

          <OpcionPerfil
            icono="settings-outline"
            texto="Configuración"
            color={colores.azul}
            onPress={() => router.push("/Pestanas/Perfil/Configuracion")}
          />

          <OpcionPerfil
            icono="log-out-outline"
            texto="Cerrar sesión"
            color={colores.azulMedio}
            onPress={() => setMostrarCierre(true)}
          />
        </View>
      </PantallaBase>

      {/* Fuera del ScrollView para que la foto no se recorte
          al superponerse sobre el borde de la hoja. */}
      <View
        pointerEvents="none"
        style={[
          styles.contenedorFoto,
          { top: insets.top + 92 },
        ]}
      >
        <View style={styles.foto}>
          <Ionicons
            name="person"
            size={52}
            color={colores.secundario}
          />
        </View>
      </View>

      <ModalConfirmacion
        visible={mostrarCierre}
        titulo="Finalizar sesión"
        mensaje="¿Estás segura de que quieres cerrar sesión?"
        textoConfirmar="Sí, finalizar sesión"
        textoCancelar="Cancelar"
        onConfirmar={confirmarCierre}
        onCancelar={() => setMostrarCierre(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  encabezado: {
    backgroundColor: colores.fondo,
    paddingHorizontal: 24,
    paddingBottom: 84,
  },
  filaEncabezado: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  botonEncabezado: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    flex: 1,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    textAlign: "center",
    color: colores.textoPrincipal,
  },
  campana: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colores.mentaClara,
    alignItems: "center",
    justifyContent: "center",
  },
  contenedorFoto: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  foto: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colores.mentaClara,
    borderWidth: 3,
    borderColor: colores.fondoClaro,
    alignItems: "center",
    justifyContent: "center",
  },
  datosPerfil: {
    alignItems: "center",
    paddingTop: 40,
  },
  nombre: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: colores.textoEtiqueta,
    textAlign: "center",
  },
  identificador: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: colores.textoEtiqueta,
    marginTop: 2,
  },
  etiquetaId: {
    fontFamily: "Poppins_600SemiBold",
  },
  opciones: {
    marginTop: 42,
    gap: 18,
  },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 54,
    gap: 14,
    paddingVertical: 4,
  },
  iconoOpcion: {
    width: 48,
    height: 48,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  textoOpcion: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: colores.textoEtiqueta,
  },
  presionado: {
    opacity: 0.7,
  },
});