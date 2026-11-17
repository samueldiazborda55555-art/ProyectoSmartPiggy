// src/servicios/servicioAutenticacion.ts
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

export type DatosPerfil = {
  nombre: string;
  telefono: string;
  fechaNacimiento: string;
};

// 1. Crea la cuenta en Authentication
// 2. Guarda el nombre dentro de esa cuenta
// 3. Crea el documento usuarios/{uid} en Firestore con los datos extra
export async function registrarUsuario(
  correo: string,
  contrasena: string,
  perfil: DatosPerfil
) {
  const credencial = await createUserWithEmailAndPassword(auth, correo, contrasena);
  const usuario = credencial.user;

  await updateProfile(usuario, { displayName: perfil.nombre });

  await setDoc(doc(db, "usuarios", usuario.uid), {
    nombre: perfil.nombre,
    correo: usuario.email,
    telefono: perfil.telefono,
    fechaNacimiento: perfil.fechaNacimiento,
    creadoEn: serverTimestamp(),
  });

  return usuario;
}

export async function iniciarSesion(correo: string, contrasena: string) {
  const credencial = await signInWithEmailAndPassword(auth, correo, contrasena);
  return credencial.user;
}

export async function cerrarSesion() {
  await signOut(auth);
}

// Avisa cada vez que entra o sale un usuario.
// Devuelve una función: al llamarla, se deja de escuchar.
export function escucharSesion(callback: (usuario: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Firebase envía un correo con un enlace para crear la contraseña nueva
export async function recuperarContrasena(correo: string) {
  await sendPasswordResetEmail(auth, correo);
}

// Lee el perfil guardado en Firestore (nombre, teléfono, etc.)
export async function obtenerPerfil(idUsuario: string) {
  const resultado = await getDoc(doc(db, "usuarios", idUsuario));
  return resultado.exists() ? resultado.data() : null;
}