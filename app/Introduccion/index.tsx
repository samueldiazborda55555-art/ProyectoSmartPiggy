import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOGO = require("../../assets/images/logo-smartpiggy.png");
const CERDITO_ALCANCIA = require("../../assets/images/cerdito-alcancia.png");
const CERDITO_CELULAR = require("../../assets/images/cerdito-celular.png");

type Slide = {
  key: string;
  tipo: "logo" | "ilustracion" | "auth";
  titulo?: string;
  imagen?: ImageSourcePropType;
  colorPanel?: string;
};

const SLIDES: Slide[] = [
  { key: "splash", tipo: "logo" },
  {
    key: "welcome",
    tipo: "ilustracion",
    titulo: "Bienvenido Al\nGestor De\nFinanzas!",
    imagen: CERDITO_ALCANCIA,
    colorPanel: "#E9EFF2",
  },
  {
    key: "cta",
    tipo: "ilustracion",
    titulo: "¿Estás Listo Para\nTomar El Control\nDe Tus Finanzas?",
    imagen: CERDITO_CELULAR,
    colorPanel: "#F8F4EE",
  },
  { key: "auth", tipo: "auth" },
];

export default function Introduccion() {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const listRef = useRef<FlatList<Slide>>(null);

  const goTo = (i: number) => {
    if (size.width <= 0) return;
    listRef.current?.scrollToIndex({ index: i, animated: true });
    setIndex(i);
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (size.width <= 0) return;
    setIndex(Math.round(e.nativeEvent.contentOffset.x / size.width));
  };

  const handleNext = () => {
    if (index < SLIDES.length - 1) goTo(index + 1);
  };

  const irAIniciarSesion = () => router.push("/Autenticacion/Iniciar-sesion");
  const irARegistro = () => router.push("/Autenticacion/Registro");

  const renderItem = ({ item }: ListRenderItemInfo<Slide>) => {
    const tamano = { width: size.width, height: size.height };

    // Slide 1: solo el logo grande, centrado
    if (item.tipo === "logo") {
      return (
        <View style={[styles.slide, styles.centrado, tamano]}>
          <Image
            source={LOGO}
            style={{ width: size.width * 0.78, height: size.width * 0.78 }}
            resizeMode="contain"
          />
        </View>
      );
    }

    // Slides 2 y 3: título arriba + panel de color redondeado con el dibujo
    if (item.tipo === "ilustracion") {
      return (
        <View style={[styles.slide, tamano]}>
          <View
            style={[
              styles.zonaTitulo,
              { height: size.height * 0.31, paddingTop: insets.top },
            ]}
          >
            <Text style={styles.titulo}>{item.titulo}</Text>
          </View>

          <View style={[styles.panel, { backgroundColor: item.colorPanel }]}>
            <Image
              source={item.imagen!}
              style={{ width: size.width * 0.98, height: size.height * 0.52 }}
              resizeMode="contain"
            />
          </View>
        </View>
      );
    }

    // Slide 4: logo pequeño + botones
    return (
      <View style={[styles.slide, styles.centrado, tamano]}>
        <Image
          source={LOGO}
          style={{ width: size.width * 0.5, height: size.width * 0.5 }}
          resizeMode="contain"
        />

        <View style={styles.authBlock}>
          <TouchableOpacity
            style={[
              styles.boton,
              styles.botonPrimario,
              { width: size.width * 0.5 },
            ]}
            onPress={irAIniciarSesion}
            activeOpacity={0.8}
          >
            <Text style={styles.botonTexto}>INICIAR SESION</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.boton,
              styles.botonSecundario,
              { width: size.width * 0.5 },
            ]}
            onPress={irARegistro}
            activeOpacity={0.8}
          >
            <Text style={styles.botonTexto}>REGISTRARSE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize((prev) =>
          prev.width === width && prev.height === height
            ? prev
            : { width, height }
        );
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {size.width > 0 && (
        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          getItemLayout={(_, i) => ({
            length: size.width,
            offset: size.width * i,
            index: i,
          })}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              listRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }, 100);
          }}
        />
      )}

      {/* Puntos + Saltar / Siguiente, encima del contenido (no en el Figma, pero útiles) */}
      {index < SLIDES.length - 1 && (
        <View
          style={[styles.overlay, { paddingBottom: insets.bottom + 16 }]}
          pointerEvents="box-none"
        >
          <View style={styles.dotsContainer}>
            {SLIDES.slice(0, SLIDES.length - 1).map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === index && styles.dotActive]}
              />
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => goTo(SLIDES.length - 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Saltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },

  slide: {
    overflow: "hidden",
  },

  centrado: {
    alignItems: "center",
    justifyContent: "center",
  },

  // --- Slides 2 y 3 ---
  zonaTitulo: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  titulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 26,
    lineHeight: 34,
    textAlign: "center",
    color: "#0b1f1c",
  },

  panel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingBottom: 8,
  },

  // --- Slide 4 ---
  authBlock: {
    marginTop: 64,
    alignItems: "center",
  },

  boton: {
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  botonPrimario: {
    backgroundColor: "#69a374",
  },

  botonSecundario: {
    backgroundColor: "#3f5f8b",
  },

  botonTexto: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.3,
    color: "#0b1b16",
  },

  // --- Puntos y navegación ---
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#c5ced6",
    marginHorizontal: 4,
  },

  dotActive: {
    backgroundColor: "#2f6f76",
    width: 20,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  skipText: {
    color: "#8a97a3",
    fontSize: 15,
  },

  nextButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2f6f76",
    alignItems: "center",
    justifyContent: "center",
  },
});