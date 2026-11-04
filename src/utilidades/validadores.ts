// src/utilidades/validadores.ts
export const MIN_CONTRASENA = 6;

export function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

export function esContrasenaValida(contrasena: string): boolean {
  return contrasena.length >= MIN_CONTRASENA;
}

export function esTelefonoValido(telefono: string): boolean {
  return /^\+?\d{7,15}$/.test(telefono.replace(/\s/g, ""));
}

// Formato DD/MM/AAAA y que sea una fecha real y no futura
export function esFechaValida(fecha: string): boolean {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(fecha.trim());
  if (!partes) return false;

  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const anio = Number(partes[3]);
  const f = new Date(anio, mes - 1, dia);

  return (
    f.getFullYear() === anio &&
    f.getMonth() === mes - 1 &&
    f.getDate() === dia &&
    anio >= 1900 &&
    f <= new Date()
  );
}

// ---- Mensajes de error (undefined = sin error) ----

export function errorObligatorio(valor: string, mensaje: string): string | undefined {
  if (!valor.trim()) return mensaje;
  return undefined;
}

export function errorCorreo(correo: string): string | undefined {
  if (!correo.trim()) return "Ingresa tu correo electrónico";
  if (!esCorreoValido(correo)) return "Escribe un correo válido, por ejemplo nombre@correo.com";
  return undefined;
}

export function errorTelefono(telefono: string): string | undefined {
  if (!telefono.trim()) return "Ingresa tu número de teléfono";
  if (!esTelefonoValido(telefono)) return "Escribe un número válido (solo dígitos)";
  return undefined;
}

export function errorFecha(fecha: string): string | undefined {
  if (!fecha.trim()) return "Ingresa tu fecha de nacimiento";
  if (!esFechaValida(fecha)) return "Usa el formato DD/MM/AAAA";
  return undefined;
}

export function errorContrasena(contrasena: string): string | undefined {
  if (!contrasena) return "Ingresa tu contraseña";
  if (!esContrasenaValida(contrasena)) {
    return `La contraseña debe tener al menos ${MIN_CONTRASENA} caracteres`;
  }
  return undefined;
}

export function errorConfirmacion(contrasena: string, confirmacion: string): string | undefined {
  if (!confirmacion) return "Confirma tu contraseña";
  if (contrasena !== confirmacion) return "Las contraseñas no coinciden";
  return undefined;
}