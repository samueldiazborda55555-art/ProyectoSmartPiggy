// src/utilidades/erroresFirebase.ts
// Convierte los códigos de error de Firebase en mensajes en español.
export function traducirErrorFirebase(error: unknown): string {
  const codigo = (error as { code?: string })?.code;

  switch (codigo) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Correo o contraseña incorrectos";
    case "auth/too-many-requests":
      return "Demasiados intentos, inténtalo más tarde";
    case "auth/network-request-failed":
      return "Sin conexión a internet";
    case "auth/email-already-in-use":
      return "Ese correo ya está registrado";
    case "auth/invalid-email":
      return "El correo no es válido";
    case "auth/weak-password":
      return "La contraseña es muy débil (mínimo 6 caracteres)";
    case "auth/requires-recent-login":
      return "Por seguridad, vuelve a iniciar sesión e inténtalo de nuevo";
    case "app/contrasena-actual-incorrecta":
      return "La contraseña actual no es correcta";
    default:
      return "Ocurrió un error, inténtalo de nuevo";
  }
}