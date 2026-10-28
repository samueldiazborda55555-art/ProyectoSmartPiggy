// src/servicios/servicioAutenticacion.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

export async function registrarUsuario(correo: string, contrasena: string) {
  const credencial = await createUserWithEmailAndPassword(auth, correo, contrasena);
  return credencial.user;
}

export async function iniciarSesion(correo: string, contrasena: string) {
  const credencial = await signInWithEmailAndPassword(auth, correo, contrasena);
  return credencial.user;
}

export async function cerrarSesion() {
  await signOut(auth);
}

// Avisa cada vez que cambia el estado de sesión (entra o sale un usuario)
export function escucharSesion(callback: (usuario: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}