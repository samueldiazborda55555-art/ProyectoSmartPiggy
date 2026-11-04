// src/servicios/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-Cwix_CeTlrNH-KXm4vjMiCEmIsfwp74",
  authDomain: "smartpiggy-980c1.firebaseapp.com",
  projectId: "smartpiggy-980c1",
  storageBucket: "smartpiggy-980c1.firebasestorage.app",
  messagingSenderId: "638101635249",
  appId: "1:638101635249:web:009470d8651844cb1fa290",
};

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
export const db = getFirestore(app);