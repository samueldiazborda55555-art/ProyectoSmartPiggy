import {
  collection,
  doc,
  getDocs,
  getDocsFromServer,
  onSnapshot,
  runTransaction,
  type QuerySnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { CATEGORIAS } from "../constants/categorias";
import type { Categoria } from "../tipos/categoria";
import { auth, db } from "./firebase";

type DatosCategoria = Pick<Categoria, "nombre" | "icono">;
export type CategoriaPropia = DatosCategoria & { id: string };

function normalizarNombre(nombre: string): string {
  return nombre.trim().toLowerCase().normalize("NFC");
}

const nombresBase = new Set(CATEGORIAS.map(({ nombre }) => normalizarNombre(nombre)));
const idsBase = new Set<string>(CATEGORIAS.map(({ id }) => id));

function verificarUsuario(idUsuario: string): void {
  if (!idUsuario?.trim() || idUsuario.includes("/") || auth.currentUser?.uid !== idUsuario) {
    throw new Error("El usuario autenticado solo puede acceder a sus categorías.");
  }

}

function coleccionCategorias(idUsuario: string) {
  verificarUsuario(idUsuario);
  return collection(db, "usuarios", idUsuario, "categorias");
}

function convertirCategorias(resultado: QuerySnapshot): CategoriaPropia[] {
  return resultado.docs.flatMap((documento) => {
    const { nombre, icono } = documento.data();
    if (
      typeof nombre !== "string" || !nombre.trim() ||
      typeof icono !== "string" || !icono.trim() ||
      idsBase.has(documento.id) || nombresBase.has(normalizarNombre(nombre))
    ) {
      return [];
    }
    return [{ id: documento.id, nombre, icono }];
  });
}

export async function crearCategoria(
  idUsuario: string,
  datos: DatosCategoria,
): Promise<CategoriaPropia> {
  const categorias = coleccionCategorias(idUsuario);
  const nombre = typeof datos?.nombre === "string" ? datos.nombre.trim() : "";
  const icono = typeof datos?.icono === "string" ? datos.icono.trim() : "";
  if (!nombre) throw new Error("El nombre de la categoría es obligatorio.");
  if (!icono) throw new Error("El icono de la categoría es obligatorio.");

  const nombreNormalizado = normalizarNombre(nombre);
  if (nombresBase.has(nombreNormalizado)) {
    throw new Error("El nombre corresponde a una categoría predeterminada.");
  }

  const clave = `nombre-${encodeURIComponent(nombreNormalizado)}`;
  if (clave.length > 1500) throw new Error("El nombre de la categoría es demasiado largo.");

  // Detecta documentos antiguos que todavía no tienen una reserva de nombre.
  const existentes = await getDocsFromServer(categorias);
  if (existentes.docs.some((documento) => {
    const existente = documento.data().nombre;
    return typeof existente === "string" && normalizarNombre(existente) === nombreNormalizado;
  })) {
    throw new Error("Ya existe una categoría con ese nombre.");
  }

  const referencia = doc(categorias);
  const reserva = doc(db, "usuarios", idUsuario, "nombresCategorias", clave);

  await runTransaction(db, async (transaccion) => {
    verificarUsuario(idUsuario);
    // Todas las altas del mismo nombre leen y escriben esta misma reserva.
    const existente = await transaccion.get(reserva);
    if (existente.exists()) throw new Error("Ya existe una categoría con ese nombre.");

    transaccion.set(reserva, { categoriaId: referencia.id });
    transaccion.set(referencia, { nombre, icono });
  });

  return { id: referencia.id, nombre, icono };
}

export async function obtenerCategoriasPropias(idUsuario: string): Promise<CategoriaPropia[]> {
  const resultado = await getDocs(coleccionCategorias(idUsuario));
  verificarUsuario(idUsuario);
  return convertirCategorias(resultado);
}

export function escucharCategorias(
  idUsuario: string,
  alCambiar: (categorias: CategoriaPropia[]) => void,
  alFallar: (error: Error) => void,
): Unsubscribe {
  try {
    return onSnapshot(
      coleccionCategorias(idUsuario),
      (resultado) => alCambiar(convertirCategorias(resultado)),
      alFallar,
    );
  } catch (error) {
    alFallar(error instanceof Error ? error : new Error(String(error)));
    return () => {};
  }
}
