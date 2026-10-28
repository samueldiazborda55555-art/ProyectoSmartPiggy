// src/servicios/firebase.ts
import { initializeApp } from "firebase/app";
// @ts-ignore: los tipos de Firebase no incluyen getReactNativePersistence, pero existe al ejecutar la app
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-Cwix_CeTlrNH-KXm4vjMiCEmIsfwp74",
  authDomain: "smartpiggy-980c1.firebaseapp.com",
  projectId: "smartpiggy-980c1",
  storageBucket: "smartpiggy-980c1.firebasestorage.app",
  messagingSenderId: "638101635249",
  appId: "1:638101635249:web:009470d8651844cb1fa290",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);