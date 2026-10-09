# Plan: Asistencia por Lección (detalle opcional sobre el día)

Fecha: 2026-10-09
Estado: aprobado el enfoque, en implementación dentro de `sandbox/`.
Depende de: `CONF_HORARIO` (ya guarda cuántas lecciones tiene cada día) — no requiere migración.

## Problema (por qué)

Hoy `ASISTENCIA_DATA` guarda **una fila por estudiante × materia × fecha** con un único
`ESTADO` (`P`, `AI`, `T`, `E`, `J`). Pero un día puede tener **N lecciones**
(`CONF_HORARIO.dias = {"Lunes": 3}`), y ese único estado se aplica a TODAS las lecciones.

Casos reales que hoy no se pueden registrar:

1. **Escapada parcial:** el estudiante está al pasar lista, se escapa en la 2.ª y 3.ª
   lección → hoy solo se puede marcar `E` para todo el día.
2. **Ausencia parcial por salud:** falta la 1.ª lección pero llega a tiempo a la 2.ª y 3.ª
   → hoy marcar `AI` castiga las 3 lecciones, cuando solo faltó 1.

## Decisiones tomadas con Nelson

- **Modalidad:** el día sigue siendo el valor por defecto; la lección es un **override
  opcional**. El flujo rápido de pasar lista no cambia (cero fricción extra).
- **Escapada (E):** se mantiene que **no resta** en el %. Cero impacto histórico.
- **Construcción:** primero en `sandbox/`, luego se promueve a producción.
- **Cero migración:** las filas existentes (sin detalle) se interpretan como estado uniforme.

## Modelo de datos (retrocompatible)

Se agrega la columna **`DETALLE_LECCION`** (columna G) a `ASISTENCIA_DATA`:

| Col | Nombre | Descripción |
|-----|--------|-------------|
| A | ID | `AS-...` |
| B | FECHA | fecha de la clase |
| C | ID_EST | estudiante |
| D | ID_MAT | materia |
| E | ESTADO | **resumen del día** (estado más severo presente) |
| F | USER | usuario que registró |
| G | **DETALLE_LECCION** | JSON `["AI","P","P"]` (una posición por lección). Vacío = uniforme (usa ESTADO) |

- **Clave de fila intacta:** `(ID_EST, ID_MAT, FECHA)`. No rompe deduplicación, alertas
  ni búsquedas.
- La columna se crea **de forma perezosa** la primera vez que se guarda (helper
  `asegurarColumnaDetalleAsistencia`), así no hay que migrar el Sheet a mano.
- **Resolución por lección** (fuente única de verdad, backend):
  `resolverEstadoLeccion(ESTADO, DETALLE, i)` → si el detalle tiene la posición `i`, la usa;
  si no, cae al `ESTADO` del día. Filas viejas = comportamiento actual exacto.

## Reglas de cálculo

- **Peso por lección:** `AI = 1`, `T = 0.5`, `E/J/P/vacío = 0` (sin cambios).
- **% de asistencia:** se recalcula **por lección** (`calcularAsistenciaMap`), con una sola
  función central. Día uniforme → mismo resultado que hoy. Día detallado → correcto.
- **Conteos de la matriz (AI/T/E/J):** se mantienen **por día** (usan el `ESTADO` resumen),
  para no alterar los números históricos ni el significado actual de las columnas.
- **Resumen del día** (qué se guarda en `ESTADO` cuando hay detalle), por severidad:
  `AI > E > T > J > P > (vacío)`.

## Cambios en el backend (`code.gs`)

1. `asegurarColumnaDetalleAsistencia(ss, sheet)` — crea la columna G si falta.
2. `resolverEstadoLeccion(estadoDia, detalleJson, i)` — fuente única de resolución.
3. `resumirEstadoDia(arr)` — calcula el `ESTADO` resumen.
4. `guardarMarcaAsistencia` / `guardarMarcaAsistenciaBatch` — aceptan `detalle` (array);
   guardan el JSON en G y el resumen en E. Si no viene detalle, limpian G (vuelve a uniforme).
5. `obtenerMatrizAsistencia` — devuelve además `detalles` (mapa `idEst|fecha` → JSON).
6. `calcularAsistenciaMap` — calcula pérdidas **por lección** (retrocompatible).
7. `obtenerAlertasTempranas` — el ausentismo también se calcula por lección (antes contaba el día completo).

## Auditoría (Bitácora de Cambios)

Cada guardado registra en `BITACORA_CAMBIOS` (tipo `ASISTENCIA`). Para que el rastro sea
"paso a paso" **incluyendo el detalle**, se usa `fmtFirmaAsistencia(estado, detalle)`:

- Día uniforme → se registra el estado (`AI`).
- Día con detalle → se registra el detalle legible (`AI·P·P`).
- Un cambio que no altera el resumen pero sí el detalle (ej. `AI` → `AI·P·P`) **sí queda
  registrado**, porque se compara la firma completa, no solo el resumen.

En la UI se consulta desde **Materias → botón "Historial de Cambios"** (y su PDF), con
fecha/hora, usuario, detalle y `anterior → nuevo`.

## Cambios en el frontend (`index.html`)

1. `loadAttendanceMatrix` — celda muestra el detalle compacto (`P·E·E`) cuando existe; si no,
   el estado del día como hoy. Preserva scroll al recargar.
2. Nuevo `openLessonDetail(...)` — editor por lección (mini-modal): N selectores, botón
   "aplicar a todas", y opción de dejar una lección "sin marcar". Guarda con `saveMark`.
3. `verFichaAsistencia` — usa el detalle para el % y lo muestra en la línea de tiempo.
4. `cycleAttendance` / `markAllPresent` — **sin cambios** (marcan el día y limpian el detalle).

## Qué NO se toca

- Alertas de asistencia pendiente (`materiasConMarca` sigue viendo la fila del día).
- Boletas, cuadro de materia, SEA, KPIs: consumen `calcularAsistenciaMap`, así que quedan
  alineados automáticamente.

## Orden de implementación

1. `sandbox/code.gs`: helpers + guardado + lectura + cálculo.
2. `sandbox/index.html`: matriz + editor por lección + ficha.
3. Verificación de sintaxis (`node --check`) y prueba con datos.
4. Promoción a producción tras validar.

## Riesgos y mitigaciones

- **Riesgo:** romper el % de datos históricos. **Mitigación:** filas sin detalle se resuelven
  idéntico a hoy.
- **Riesgo:** perder rapidez al pasar lista. **Mitigación:** el detalle es opcional y solo
  aplica a días con más de una lección.
