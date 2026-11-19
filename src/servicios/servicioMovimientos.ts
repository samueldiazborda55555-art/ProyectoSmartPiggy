import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  type FirestoreError,
  type QuerySnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { CATEGORIAS } from "../constants/categorias";
import type { CategoriaId } from "../tipos/categoria";
import type { Movimiento } from "../tipos/movimiento";
import { auth, db } from "./firebase";

type DatosMovimiento = Omit<Movimiento, "id">;

const categoriasValidas = new Set<CategoriaId>([
  ...CATEGORIAS.map(({ id }) => id),
  "ingresos",
  "personalizada",
]);

function coleccionMovimientos(idUsuario: string) {
  if (!idUsuario?.trim() || idUsuario.includes("/") || auth.currentUser?.uid !== idUsuario) {
    throw new Error("El usuario autenticado solo puede acceder a sus movimientos.");
  }

  return collection(db, "usuarios", idUsuario, "movimientos");
}

function consultaMovimientos(idUsuario: string) {
  return query(coleccionMovimientos(idUsuario), orderBy("fecha", "desc"));
}

function convertirMovimientos(resultado: QuerySnapshot): Movimiento[] {
  return resultado.docs.map((documento) => ({
    ...(documento.data() as DatosMovimiento),
    id: documento.id,
  }));
}

export async function crearMovimiento(
  idUsuario: string,
  datos: DatosMovimiento,
): Promise<Movimiento> {
  if (!datos) {
    throw new Error("Los datos del movimiento son obligatorios.");
  }

  const { nombre, monto, fecha, categoriaId, tipo, mensaje } = datos;

  if (!Number.isFinite(monto) || monto <= 0) {
    throw new Error("El monto debe ser un número finito mayor que cero.");
  }
  if (typeof nombre !== "string" || !nombre.trim()) {
    throw new Error("El nombre del movimiento es obligatorio.");
  }
  if (tipo !== "ingreso" && tipo !== "gasto") {
    throw new Error("El tipo de movimiento debe ser ingreso o gasto.");
  }
  if (!categoriasValidas.has(categoriaId)) {
    throw new Error("La categoría del movimiento no es válida.");
  }
  if (mensaje !== undefined && typeof mensaje !== "string") {
    throw new Error("El mensaje debe ser texto.");
  }

  const formatoISO =
    /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/;
  if (typeof fecha !== "string" || !formatoISO.test(fecha)) {
    throw new Error("La fecha del movimiento debe usar ISO 8601 con zona horaria explícita.");
  }

  const dia = fecha.slice(0, 10);
  const fechaCalendario = new Date(`${dia}T00:00:00Z`);
  const fechaMovimiento = new Date(fecha);
  const anioUTC = fechaMovimiento.getUTCFullYear();
  if (
    !Number.isFinite(fechaMovimiento.getTime()) ||
    !Number.isFinite(fechaCalendario.getTime()) ||
    fechaCalendario.toISOString().slice(0, 10) !== dia ||
    anioUTC < 0 ||
    anioUTC > 9999
  ) {
    throw new Error("La fecha del movimiento no es válida.");
  }

  const movimiento: DatosMovimiento = {
    nombre,
    monto,
    fecha: fechaMovimiento.toISOString(),
    categoriaId,
    tipo,
    ...(mensaje === undefined ? {} : { mensaje }),
  };
  const referencia = await addDoc(coleccionMovimientos(idUsuario), movimiento);
  return { ...movimiento, id: referencia.id };
}

export async function obtenerMovimientos(idUsuario: string): Promise<Movimiento[]> {
  const resultado = await getDocs(consultaMovimientos(idUsuario));
  return convertirMovimientos(resultado);
}

export function escucharMovimientos(
  idUsuario: string,
  alCambiar: (movimientos: Movimiento[]) => void,
  alFallar: (error: FirestoreError) => void,
): Unsubscribe {
  return onSnapshot(
    consultaMovimientos(idUsuario),
    (resultado) => alCambiar(convertirMovimientos(resultado)),
    alFallar,
  );
}

export async function eliminarMovimiento(
  idUsuario: string,
  idMovimiento: string,
): Promise<void> {
  if (typeof idMovimiento !== "string" || !idMovimiento.trim() || idMovimiento.includes("/")) {
    throw new Error("El identificador del movimiento no es válido.");
  }

  await deleteDoc(doc(coleccionMovimientos(idUsuario), idMovimiento));
}
