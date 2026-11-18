# Estructura de Firestore de SmartPiggy

Sprint 3 · Tarea 2 de Miguel

La configuración de [Firebase](../src/servicios/firebase.ts) apunta a `smartpiggy-980c1`. El [servicio de autenticación](../src/servicios/servicioAutenticacion.ts) ya escribe el perfil en `usuarios/{uid}`. Las demás rutas de este documento definen el esquema propuesto para el sprint.

## Colecciones

| Ruta del documento | Contenido |
| --- | --- |
| `usuarios/{uid}` | Perfil del usuario |
| `usuarios/{uid}/movimientos/{movimientoId}` | Ingreso o gasto |
| `usuarios/{uid}/metas/{metaId}` | Meta de ahorro |
| `usuarios/{uid}/metas/{metaId}/aportes/{aporteId}` | Aporte a una meta |
| `usuarios/{uid}/categorias/{categoriaId}` | Categoría personalizada |

## Campos y ejemplos

Los ejemplos muestran los campos del documento. Los identificadores forman parte de la ruta. En el perfil, el objeto JSON de `creadoEn` ilustra los componentes de un `Timestamp` nativo de Firestore. El registro existente lo escribe con `serverTimestamp()`.

### Usuario

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| `nombre` | `string` | Sí |
| `correo` | `string` | Sí |
| `telefono` | `string` | Sí |
| `fechaNacimiento` | `string` | Sí |
| `creadoEn` | `Timestamp` | Sí |

```json
{
  "nombre": "Ana Pérez",
  "correo": "ana@example.com",
  "telefono": "+573001234567",
  "fechaNacimiento": "1998-05-14",
  "creadoEn": { "seconds": 1777543200, "nanoseconds": 0 }
}
```

### Movimiento

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| `nombre` | `string` | Sí |
| `monto` | `number` | Sí |
| `fecha` | `string` | Sí |
| `categoriaId` | `CategoriaId` | Sí |
| `tipo` | `'ingreso' \| 'gasto'` | Sí |
| `mensaje` | `string` | Opcional |

```json
{
  "nombre": "Mercado semanal",
  "monto": 85000,
  "fecha": "2026-11-17T09:30:00",
  "categoriaId": "alimentos",
  "tipo": "gasto",
  "mensaje": "Compra de la semana"
}
```

### Meta

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| `nombre` | `string` | Sí |
| `montoObjetivo` | `number` | Sí |
| `montoAhorrado` | `number` | Sí |
| `icono` | `string` | Sí |

```json
{
  "nombre": "Viaje",
  "montoObjetivo": 1500000,
  "montoAhorrado": 0,
  "icono": "airplane"
}
```

### Aporte

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| `monto` | `number` | Sí |
| `fecha` | `string` | Sí |
| `mensaje` | `string` | Opcional, propuesto para el Sprint 3 |

```json
{
  "monto": 100000,
  "fecha": "2026-11-17T16:15:00",
  "mensaje": "Aporte de noviembre"
}
```

### Categoría personalizada

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| `nombre` | `string` | Sí |
| `icono` | `string` | Sí |

```json
{
  "nombre": "Mascotas",
  "icono": "paw"
}
```

## Reglas de almacenamiento

- El monto de cada movimiento y aporte y el monto objetivo de cada meta deben ser mayores que cero. `tipo` indica si un movimiento es un ingreso o un gasto.
- Las metas nuevas comienzan con `montoAhorrado: 0`. El total representa la suma de los aportes vigentes y es cero si la meta carece de aportes.
- `fecha` y `fechaNacimiento` se guardan como cadenas ISO 8601. Los ejemplos de movimientos y aportes conservan el formato local actual `YYYY-MM-DDTHH:mm:ss`, y el de nacimiento usa `YYYY-MM-DD`. `creadoEn` conserva su tipo `Timestamp`.
- Firestore genera los identificadores de movimientos, metas, aportes y categorías personalizadas. El UID del perfil proviene de Firebase Authentication. Al leer, los servicios obtienen el `id` del objeto a partir del ID del documento.
- Cada usuario accede únicamente a sus datos. El criterio de acceso para el perfil y sus subcolecciones es que el UID autenticado coincida con el `{uid}` de la ruta.
- Las nueve categorías base permanecen en [categorias.ts](../src/constants/categorias.ts): `comida`, `transporte`, `medicina`, `alimentos`, `alquiler`, `regalos`, `ahorros`, `entretenimiento` y `mas`. Las categorías personalizadas se guardan en Firestore bajo el usuario.
- Los aportes se guardan como documentos de la subcolección `aportes`. El documento de la meta contiene el total acumulado.
- Crear, editar o eliminar un aporte debe actualizar `montoAhorrado` en la misma operación atómica de Firestore. Una transacción aplica la diferencia entre el monto anterior y el nuevo cuando el cálculo depende del estado leído. Si la operación falla, ambos cambios se descartan.

## Compatibilidad pendiente de aprobación

1. **`Meta.aportes`.** La [interfaz Meta](../src/tipos/meta.ts) exige `aportes: Aporte[]`. El servicio de metas leerá la subcolección y reconstruirá el arreglo, usando el ID de cada documento como `Aporte.id`. Si la subcolección está vacía, devolverá `aportes: []`. El equipo debe aprobar este contrato de lectura.
2. **`Aporte.mensaje`.** El esquema propone guardar este campo opcional. El tipo actual de `Aporte` declara `id`, `fecha` y `monto`. El equipo debe aprobar la incorporación de `mensaje?: string` al contrato del frontend si se va a exponer en la app.
3. **`CategoriaId`.** La [unión literal actual](../src/tipos/categoria.ts) incluye las nueve categorías base y los valores especiales `ingresos` y `personalizada`. El equipo debe aprobar cómo representar también los IDs generados por Firestore para identificar cada categoría personalizada y cómo conservar el significado de los valores especiales existentes. La validación de un ID personalizado debe comprobar que corresponde a una categoría del mismo usuario.
