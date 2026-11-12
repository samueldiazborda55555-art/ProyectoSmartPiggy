// src/servicios/servicioAutenticacion.ts
export async function enviarCorreoRecuperacion(correo: string) {
  await sendPasswordResetEmail(auth, correo);
}

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

type DatosPerfil = {
  nombre: string;
  telefono: string;
  fechaNacimiento: string;
};

export async function registrarUsuario(
  correo: string,
  contrasena: string,
  perfil?: DatosPerfil
) {
  const credencial = await createUserWithEmailAndPassword(auth, correo, contrasena);
  const usuario = credencial.user;

  // Guarda los datos extra en Firestore: usuarios/{uid}
  if (perfil) {
    await setDoc(doc(db, "usuarios", usuario.uid), {
      nombre: perfil.nombre,
      correo: usuario.email,
      telefono: perfil.telefono,
      fechaNacimiento: perfil.fechaNacimiento,
      creadoEn: serverTimestamp(),
    });
  }

  return usuario;
}

export async function iniciarSesion(correo: string, contrasena: string) {
  const credencial = await signInWithEmailAndPassword(auth, correo, contrasena);
  return credencial.user;
}

export async function cerrarSesion() {
  await signOut(auth);
}

// Lee el perfil guardado en Firestore (nombre, teléfono, etc.)
export async function obtenerPerfil(idUsuario: string) {
  const resultado = await getDoc(doc(db, "usuarios", idUsuario));
  return resultado.exists() ? resultado.data() : null;
}

// Avisa cada vez que cambia el estado de sesión (entra o sale un usuario)
export function escucharSesion(callback: (usuario: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}