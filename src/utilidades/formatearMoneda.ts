export function formatearMoneda(valor: number): string {
  const negativo = valor < 0;
  const [entero, decimales] = Math.abs(valor).toFixed(2).split(".");
  const conPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negativo ? "-" : ""}$${conPuntos},${decimales}`;
}