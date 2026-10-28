import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Slide = {
  key: string;
  title?: string;
  showLogo?: boolean;
  showAuth?: boolean;
};

const SLIDES: Slide[] = [
  { key: "splash", showLogo: true },
  { key: "welcome", title: "Bienvenido Al\nGestor De\nFinanzas!" },
  {
    key: "cta",
    title: "¿Estás Listo Para\nTomar El Control\nDe Tus Finanzas?",
  },
  { key: "auth", showLogo: true, showAuth: true },
];

function PiggyIcon({ size = 140 }: { size?: number }) {
  return (
    <View
      style={[
        styles.piggyWrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Ionicons name="paw" size={size * 0.55} color="#2f6f76" />
    </View>
  );
}

export default function OnboardingPreview() {
  const [index, setIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);
  const [listHeight, setListHeight] = useState(0);

  const listRef = useRef<FlatList<Slide>>(null);

  const goTo = (i: number) => {
    if (screenWidth <= 0) return;

    listRef.current?.scrollToIndex({
      index: i,
      animated: true,
    });

    setIndex(i);
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (screenWidth <= 0) return;

    const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);

    setIndex(newIndex);
  };

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      goTo(index + 1);
    }
  };

  const irAIniciarSesion = () => {
    router.push("/Autenticacion/Iniciar-sesion");
  };

  const irARegistro = () => {
    router.push("/Autenticacion/Registro");
  };

  const renderItem = ({ item }: ListRenderItemInfo<Slide>) => {
    return (
      <View
        style={[
          styles.slide,
          {
            width: screenWidth,
            height: listHeight,
          },
        ]}
      >
        {item.showLogo && (
          <View style={styles.logoBlock}>
            <PiggyIcon size={130} />

            <Text style={styles.logoText}>
              smartp<Text style={styles.logoAccent}>i</Text>ggy
            </Text>
          </View>
        )}

        {item.title && (
          <View style={styles.contentBlock}>
            <Text style={styles.title}>{item.title}</Text>
            <PiggyIcon size={150} />
          </View>
        )}

        {item.showAuth && (
          <View style={styles.authBlock}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={irAIniciarSesion}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonPrimaryText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={irARegistro}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonSecondaryText}>REGISTRARSE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/Autenticacion/Recuperar-contrasena")}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>¿Olvidó su contraseña?</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const width = event.nativeEvent.layout.width;

        setScreenWidth((previousWidth) =>
          previousWidth === width ? previousWidth : width,
        );
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <FlatList
        ref={listRef}
        style={styles.list}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onLayout={(event) => {
          setListHeight(event.nativeEvent.layout.height);
        }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, i) => ({
          length: screenWidth,
          offset: screenWidth * i,
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

      {index < SLIDES.length - 1 && (
        <View style={styles.dotsContainer}>
          {SLIDES.slice(0, SLIDES.length - 1).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
      )}

      {index < SLIDES.length - 1 && (
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

  list: {
    flex: 1,
    width: "100%",
  },

  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    overflow: "hidden",
  },

  logoBlock: {
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: "700",
    color: "#1f2d3d",
  },

  logoAccent: {
    color: "#2f6f76",
  },

  contentBlock: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#1f2d3d",
    marginBottom: 32,
    lineHeight: 32,
  },

  piggyWrap: {
    backgroundColor: "#eef3f5",
    alignItems: "center",
    justifyContent: "center",
  },

  authBlock: {
    width: "100%",
    maxWidth: 360,
    marginTop: 36,
    alignItems: "center",
  },

  button: {
    width: "100%",
    minHeight: 54,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  buttonPrimary: {
    backgroundColor: "#4caf7d",
  },

  buttonPrimaryText: {
    color: "#ffffff",
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  buttonSecondary: {
    backgroundColor: "#1f3a5f",
  },

  buttonSecondaryText: {
    color: "#ffffff",
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  forgotText: {
    marginTop: 4,
    color: "#5c6b7a",
    fontSize: 13,
    textAlign: "center",
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 16,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d8dfe3",
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
    paddingTop: 8,
    paddingBottom: 20,
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
