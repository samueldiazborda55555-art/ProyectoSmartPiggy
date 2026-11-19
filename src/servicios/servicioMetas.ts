import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDocsFromServer,
  limit,
  onSnapshot,
  query,
  runTransaction,
  type DocumentData,
  type DocumentReference,
  type FirestoreError,
  type QuerySnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import type { Aporte, Meta } from "../tipos/meta";
import { auth, db } from "./firebase";

type DatosMeta = Pick<Meta, "nombre" | "icono" | "montoObjetivo">;
type MetaGuardada = Omit<Meta, "aportes">;

function verificarUsuario(idUsuario: string) {
  if (!idUsuario?.trim() || idUsuario.includes("/") || auth.currentUser?.uid !== idUsuario) {
    throw new Error("El usuario autenticado solo puede acceder a sus metas.");
  }
}

function coleccionMetas(idUsuario: string) {
  verificarUsuario(idUsuario);
  return collection(db, "usuarios", idUsuario, "metas");
}

function convertirAportes(resultado: QuerySnapshot): Aporte[] {
  return resultado.docs.map((documento) => {
    const { fecha, monto } = documento.data() as Omit<Aporte, "id">;
    return { id: documento.id, fecha, monto };
  });
}

function convertirMeta(id: string, datos: DocumentData): MetaGuardada {
  const { nombre, icono, montoObjetivo, montoAhorrado } = datos as Omit<MetaGuardada, "id">;
  return { id, nombre, icono, montoObjetivo, montoAhorrado };
}

export async function crearMeta(idUsuario: string, datos: DatosMeta): Promise<Meta> {
  const metas = coleccionMetas(idUsuario);
  const { nombre, icono, montoObjetivo } = datos;
  if (typeof nombre !== "string" || !nombre.trim()) {
    throw new Error("El nombre de la meta es obligatorio.");
  }
  if (typeof icono !== "string" || !icono.trim()) {
    throw new Error("El icono de la meta es obligatorio.");
  }
  if (!Number.isFinite(montoObjetivo) || montoObjetivo <= 0) {
    throw new Error("El monto objetivo debe ser un número finito mayor que cero.");
  }

  const meta = { nombre, icono, montoObjetivo, montoAhorrado: 0 };
  const referencia = await addDoc(metas, meta);
  return { ...meta, id: referencia.id, aportes: [] };
}

export async function obtenerMetas(idUsuario: string): Promise<Meta[]> {
  const resultado = await getDocs(coleccionMetas(idUsuario));
  verificarUsuario(idUsuario);
  const metas = await Promise.all(resultado.docs.map(async (documento) => {
    const aportes = await getDocs(collection(documento.ref, "aportes"));
    return { ...convertirMeta(documento.id, documento.data()), aportes: convertirAportes(aportes) };
  }));
  verificarUsuario(idUsuario);
  return metas;
}

export function escucharMetas(
  idUsuario: string,
  alCambiar: (metas: Meta[]) => void,
  alFallar: (error: FirestoreError) => void,
): Unsubscribe {
  const metas = coleccionMetas(idUsuario);
  const escuchas = new Map<string, { aportes?: Aporte[]; cancelar?: Unsubscribe }>();
  let documentos: MetaGuardada[] = [];
  let activa = true;
  let cancelarMetas: Unsubscribe | undefined;
  let cancelarSesion: Unsubscribe | undefined;

  function cancelar() {
    if (!activa) return;
    activa = false;
    cancelarMetas?.();
    cancelarSesion?.();
    escuchas.forEach((escucha) => escucha.cancelar?.());
    escuchas.clear();
  }

  function fallar(error: FirestoreError) {
    if (!activa) return;
    cancelar();
    alFallar(error);
  }

  function publicar() {
    if (!activa || auth.currentUser?.uid !== idUsuario) return;
    const completas: Meta[] = [];
    for (const meta of documentos) {
      const aportes = escuchas.get(meta.id)?.aportes;
      if (aportes === undefined) return;
      completas.push({ ...meta, aportes });
    }
    alCambiar(completas);
  }

  function escucharAportes(referencia: DocumentReference) {
    const { id } = referencia;
    const escucha: { aportes?: Aporte[]; cancelar?: Unsubscribe } = {};
    escuchas.set(id, escucha);
    escucha.cancelar = onSnapshot(
      collection(referencia, "aportes"),
      (resultado) => {
        if (!activa || escuchas.get(id) !== escucha) return;
        escucha.aportes = convertirAportes(resultado);
        publicar();
      },
      (error) => {
        if (escuchas.get(id) === escucha) fallar(error);
      },
    );
  }

  cancelarMetas = onSnapshot(metas, (resultado) => {
    if (!activa || auth.currentUser?.uid !== idUsuario) return;
    documentos = resultado.docs.map((documento) => convertirMeta(documento.id, documento.data()));
    const ids = new Set(documentos.map((meta) => meta.id));
    for (const [id, escucha] of escuchas) {
      if (!ids.has(id)) {
        escuchas.delete(id);
        escucha.cancelar?.();
      }
    }
    for (const documento of resultado.docs) {
      if (!escuchas.has(documento.id)) escucharAportes(documento.ref);
    }
    publicar();
  }, fallar);
  cancelarSesion = onAuthStateChanged(auth, (usuario) => {
    if (usuario?.uid !== idUsuario) cancelar();
  });
  return cancelar;
}

export async function eliminarMeta(idUsuario: string, idMeta: string): Promise<void> {
  const metas = coleccionMetas(idUsuario);
  if (typeof idMeta !== "string" || !idMeta.trim() || idMeta.includes("/")) {
    throw new Error("El identificador de la meta no es válido.");
  }

  const meta = doc(metas, idMeta);
  const tamanoPagina = 200;
  const paginaAportes = query(collection(meta, "aportes"), limit(tamanoPagina));
  let terminada = false;
  while (!terminada) {
    terminada = await runTransaction(db, async (transaccion) => {
      verificarUsuario(idUsuario);
      // Los escritores de aportes deben actualizar la meta en la misma operación.
      const actual = await transaccion.get(meta);
      const aportes = await getDocsFromServer(paginaAportes);
      verificarUsuario(idUsuario);

      for (const aporte of aportes.docs) transaccion.delete(aporte.ref);
      if (aportes.size < tamanoPagina) {
        transaccion.delete(meta);
        return true;
      }

      if (actual.exists()) {
        const retirado = convertirAportes(aportes).reduce((total, aporte) => total + aporte.monto, 0);
        transaccion.update(meta, {
          montoAhorrado: Math.max(0, convertirMeta(actual.id, actual.data()).montoAhorrado - retirado),
        });
      }
      return false;
    });
  }
}
