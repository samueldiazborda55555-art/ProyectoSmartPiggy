import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PantallaBase from "@/components/disposicion/PantallaBase";
import { colores } from "@/constants/colores";

type Errores = {
  nombre?: string;
  telefono?: string;
  correo?: string;
};

export default function EditarPerfil() {
  const insets = useSafeAreaInsets();

  // Datos temporales hasta conectar el perfil real.
  const [nombre, setNombre] = useState("Sara Culma");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const [notificaciones, setNotificaciones] = useState(true);
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [seleccionando, setSeleccionando] = useState(false);

  const selectorAbierto = useRef(false);

  function limpiarError(campo: keyof Errores) {
    setErrores((anteriores) => ({
      ...anteriores,
      [campo]: undefined,
    }));
  }

  async function seleccionarFoto() {
    if (selectorAbierto.current) return;

    selectorAbierto.current = true;
    setSeleccionando(true);

    try {
      const permiso =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permiso.granted) {
        if (permiso.canAskAgain) {
          Alert.alert(
            "Permiso para fotos",
            "Permite el acceso a tus fotos para elegir una imagen de perfil."
          );
        } else {
          Alert.alert(
            "Acceso a fotos desactivado",
            "Puedes habilitar el permiso desde los ajustes del teléfono.",
            [
              {
                text: "Cancelar",
                style: "cancel",
              },
              {
                text: "Abrir ajustes",
                onPress: () => {
                  void Linking.openSettings().catch(() => {
                    Alert.alert(
                      "No se pudieron abrir los ajustes",
                      "Abre los ajustes del teléfono y revisa el permiso de fotos."
                    );
                  });
                },
              },
            ]
          );
        }

        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets?.[0]) {
        setFotoUri(resultado.assets[0].uri);
      }
    } catch {
      Alert.alert(
        "No se pudo seleccionar la foto",
        "Inténtalo nuevamente."
      );
    } finally {
      selectorAbierto.current = false;
      setSeleccionando(false);
    }
  }

  function validar() {
    const nuevos: Errores = {};
    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim();

    // Permite espacios, guiones y paréntesis al escribir el teléfono.
    const telefonoLimpio = telefono.replace(/[\s()-]/g, "");

    if (!nombreLimpio) {
      nuevos.nombre = "Ingresa tu nombre de usuario";
    } else if (nombreLimpio.length < 2) {
      nuevos.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!telefono.trim()) {
      nuevos.telefono = "Ingresa tu teléfono";
    } else if (!/^\+?\d{7,15}$/.test(telefonoLimpio)) {
      nuevos.telefono =
        "Ingresa un teléfono válido de 7 a 15 dígitos";
    }

    if (!correoLimpio) {
      nuevos.correo = "Ingresa tu correo electrónico";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
      nuevos.correo = "Ingresa un correo electrónico válido";
    }

    setErrores(nuevos);

    return Object.keys(nuevos).length === 0;
  }

  function actualizarPerfil() {
    if (!validar()) return;

    // Datos preparados para la futura conexión:
    // {
    //   nombre: nombre.trim(),
    //   telefono: telefono.replace(/[\s()-]/g, ""),
    //   correo: correo.trim(),
    //   fotoUri,
    //   notificaciones,
    //   temaOscuro,
    // }
    //
    // Karen o Miguel conectarán aquí el servicio.
    // La foto debe subirse y obtener una URL permanente.
    // Cambiar el correo de acceso requiere actualizar Firebase Auth.

    Alert.alert(
      "Datos validados",
      "Los campos están completos. El guardado del perfil todavía está pendiente de conexión."
    );
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
                    router.replace("/Pestanas/Perfil");
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

              <Text style={styles.titulo}>
                Editar perfil
              </Text>

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
          <Text style={styles.nombre}>
            {nombre.trim() || "Tu nombre"}
          </Text>

          <Text style={styles.identificador}>
            <Text style={styles.etiquetaId}>ID: </Text>
            25030024
          </Text>
        </View>

        <View style={styles.formulario}>
          <Text style={styles.subtitulo}>
            Configuración
          </Text>

          <View style={styles.grupo}>
            <Text style={styles.etiqueta}>
              Nombre de usuario
            </Text>

            <TextInput
              style={[
                styles.campo,
                !!errores.nombre && styles.campoError,
              ]}
              value={nombre}
              onChangeText={(valor) => {
                setNombre(valor);
                limpiarError("nombre");
              }}
              placeholder="Escribe tu nombre"
              placeholderTextColor={colores.textoSecundario}
              autoCapitalize="words"
              accessibilityLabel="Nombre de usuario"
            />

            {!!errores.nombre && (
              <Text style={styles.error}>
                {errores.nombre}
              </Text>
            )}
          </View>

          <View style={styles.grupo}>
            <Text style={styles.etiqueta}>
              Teléfono
            </Text>

            <TextInput
              style={[
                styles.campo,
                !!errores.telefono && styles.campoError,
              ]}
              value={telefono}
              onChangeText={(valor) => {
                setTelefono(valor);
                limpiarError("telefono");
              }}
              placeholder="+57 300 000 0000"
              placeholderTextColor={colores.textoSecundario}
              keyboardType="phone-pad"
              accessibilityLabel="Teléfono"
            />

            {!!errores.telefono && (
              <Text style={styles.error}>
                {errores.telefono}
              </Text>
            )}
          </View>

          <View style={styles.grupo}>
            <Text style={styles.etiqueta}>
              Correo electrónico
            </Text>

            <TextInput
              style={[
                styles.campo,
                !!errores.correo && styles.campoError,
              ]}
              value={correo}
              onChangeText={(valor) => {
                setCorreo(valor);
                limpiarError("correo");
              }}
              placeholder="nombre@correo.com"
              placeholderTextColor={colores.textoSecundario}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Correo electrónico"
            />

            {!!errores.correo && (
              <Text style={styles.error}>
                {errores.correo}
              </Text>
            )}
          </View>

          <View style={styles.interruptores}>
            <View style={styles.filaInterruptor}>
              <Text style={styles.textoInterruptor}>
                Notificaciones push
              </Text>

              <Switch
                value={notificaciones}
                onValueChange={setNotificaciones}
                trackColor={{
                  false: colores.mentaApagada,
                  true: colores.menta,
                }}
                thumbColor={colores.fondoClaro}
                accessibilityLabel="Notificaciones push"
              />
            </View>

            <View style={styles.filaInterruptor}>
              <Text style={styles.textoInterruptor}>
                Activar tema oscuro
              </Text>

              <Switch
                value={temaOscuro}
                onValueChange={setTemaOscuro}
                trackColor={{
                  false: colores.mentaApagada,
                  true: colores.menta,
                }}
                thumbColor={colores.fondoClaro}
                accessibilityLabel="Activar tema oscuro"
              />
            </View>
          </View>

          <Pressable
            onPress={actualizarPerfil}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.botonActualizar,
              pressed && styles.presionado,
            ]}
          >
            <Text style={styles.textoBoton}>
              Actualizar perfil
            </Text>
          </Pressable>
        </View>
      </PantallaBase>

      <View
        pointerEvents="box-none"
        style={[
          styles.contenedorFoto,
          { top: insets.top + 92 },
        ]}
      >
        <Pressable
          onPress={seleccionarFoto}
          disabled={seleccionando}
          accessibilityRole="button"
          accessibilityLabel="Elegir foto de perfil"
          accessibilityState={{ disabled: seleccionando }}
          style={({ pressed }) => [
            styles.foto,
            (pressed || seleccionando) && styles.presionado,
          ]}
        >
          {fotoUri ? (
            <Image
              source={{ uri: fotoUri }}
              style={styles.imagenPerfil}
              resizeMode="cover"
              accessibilityLabel="Foto de perfil seleccionada"
            />
          ) : (
            <Ionicons
              name="person"
              size={52}
              color={colores.secundario}
            />
          )}

          <View style={styles.iconoCamara}>
            <Ionicons
              name="camera-outline"
              size={17}
              color={colores.textoEtiqueta}
            />
          </View>
        </Pressable>
      </View>
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
    paddingBottom: 80,
  },
  filaEncabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 40,
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
    color: colores.textoPrincipal,
    textAlign: "center",
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
  imagenPerfil: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
  },
  iconoCamara: {
    position: "absolute",
    right: -1,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colores.acento,
    borderWidth: 2,
    borderColor: colores.hojaClara,
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
  formulario: {
    marginTop: 32,
  },
  subtitulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: colores.textoEtiqueta,
    marginBottom: 24,
  },
  grupo: {
    marginBottom: 20,
  },
  etiqueta: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.textoEtiqueta,
    marginBottom: 7,
  },
  campo: {
    minHeight: 42,
    backgroundColor: colores.fondoClaro,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: colores.textoPrincipal,
  },
  campoError: {
    borderColor: colores.error,
  },
  error: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    lineHeight: 18,
    color: colores.error,
    marginTop: 5,
  },
  interruptores: {
    marginTop: 4,
    gap: 12,
  },
  filaInterruptor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 42,
  },
  textoInterruptor: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: colores.textoEtiqueta,
  },
  botonActualizar: {
    alignSelf: "center",
    minHeight: 44,
    borderRadius: 24,
    backgroundColor: colores.acento,
    paddingHorizontal: 26,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  textoBoton: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: colores.textoPrincipal,
    textAlign: "center",
  },
  presionado: {
    opacity: 0.75,
  },
});