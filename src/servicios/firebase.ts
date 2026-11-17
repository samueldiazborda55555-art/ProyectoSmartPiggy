// src/servicios/firebase.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// Las claves vienen del archivo .env (que NO se sube a GitHub).
// Se escribe process.env.EXPO_PUBLIC_NOMBRE completo, tal cual.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    "Falta configurar Firebase: copia .env.example a .env, pega los valores " +
      "y reinicia con: npx expo start -c"
  );
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function crearAuth() {
  // En el navegador, Firebase ya guarda la sesión solo
  if (Platform.OS === "web") {
    return getAuth(app);
  }

  // En celular (Expo Go) usamos AsyncStorage para que la sesión persista
  const { getReactNativePersistence } = require("firebase/auth");
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Si Auth ya estaba iniciado (por ejemplo al recargar), lo reutilizamos
    return getAuth(app);
  }
}

export const auth = crearAuth();
auth.languageCode = "es"; // los correos de Firebase llegan en español
export const db = getFirestore(app);