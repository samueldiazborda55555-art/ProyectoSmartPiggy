const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function nombreMes(iso: string): string {
  return MESES[new Date(iso).getMonth()];
}

// "2026-04-30T18:27" -> "18:27 - Abril 30"
export function formatearFechaHora(iso: string): string {
  const f = new Date(iso);
  const minutos = String(f.getMinutes()).padStart(2, "0");
  return `${f.getHours()}:${minutos} - ${MESES[f.getMonth()]} ${f.getDate()}`;
}