# Plan: Campo de Periodo, Nota Final Anual y Clonado de Indicadores

Fecha: 2026-07-02
Estado: propuesta, sin implementar aún.
Depende de: [analisis-motor-calificacion.md](analisis-motor-calificacion.md) (motor de peso fijo, Opción B) — se recomienda implementar primero, porque este plan también toca `guardarCalificaciones`/`obtenerCuadroMateria`/etc.

## Confirmado con Nelson
- La nota final combinando I y II Periodo es un **promedio simple** de ambos periodos.
- Objetivo: que al cierre del año se pueda dar un informe con Nota I Periodo, Nota II Periodo y Nota Final, sin tener que borrar los datos de un periodo para calcular el otro (como se tuvo que hacer manualmente hoy).

## Hallazgo clave
`MATERIAS`, `INDICADORES` y `NOTAS` no tienen ningún campo de periodo hoy. Solo `PLANEAMIENTOS` lo tiene. Por eso, hasta ahora, la única forma de "cerrar" un periodo era borrar los indicadores/notas viejos antes de empezar el nuevo — no existía otra manera de separar qué pertenece a qué periodo.

`SECCIONES` ya guarda las fechas de ambos periodos en un solo registro (`fechasJSON: [{p:1,...},{p:2,...}]`), lo cual sugiere que la intención original era que una sección se reutilice todo el año — solo faltaba propagar ese concepto de periodo hasta INDICADORES.

## Cambios propuestos

### 1. Nuevo campo `PERIODO` en INDICADORES
- Se agrega al crear el indicador (`guardarIndicador`), determinado automáticamente comparando la fecha actual contra el `fechasJSON` de la `SECCION` a la que pertenece la materia — el profe no tiene que elegirlo a mano, se infiere solo.
- `NOTAS` no necesita el campo — hereda el periodo de su indicador (vía `ID_INDICADOR_FK`).

### 2. Reportes con filtro de periodo
- `obtenerCuadroMateria(idMateria, periodo)`
- `obtenerBoletaEstudiante(idEstudiante, periodo)`
- `obtenerDatosReporteSEA(idMateria, periodo)`
- `obtenerDatosEvaluacion` / pantalla de calificar: al elegir un indicador para calificar, ya trae implícito su periodo (no hace falta tocarla).
- Nota: esto también requiere un selector de periodo en el frontend (`index.html`) donde hoy se elige la materia — fuera del alcance de este documento, pero hay que preverlo.

### 3. Nuevo reporte: Nota Final Anual
- `obtenerNotaFinalAnual(idMateria, idEstudiante)` (o por sección completa): calcula `notaFinal = round((notaFinalPeriodo1 + notaFinalPeriodo2) / 2)`, reutilizando el cálculo ya existente de cada periodo.
- Manejar el caso "II Periodo todavía no tiene notas" (mostrar "Pendiente" en vez de forzar un promedio con un lado en cero).

### 4. Clonado de estructura de Indicadores hacia Periodo 2
- Ya NO hace falta clonar Estudiantes ni Materias — son compartidos entre periodos vía la misma Sección.
- Se agrega una acción "Clonar indicadores a Periodo 2" por materia: toma los indicadores de Periodo 1 de esa materia y crea copias con:
  - Nuevo `ID_INDICADOR` (generado, no reutiliza el viejo)
  - Mismo `CATEGORIA`, `DESCRIPCION`, `PUNTAJE_MAX`, `PUNTOS_TOTALES`
  - `PERIODO = 2`
  - `FECHA` en blanco o la fecha de clonado (a decidir con Nelson, no crítico)
  - **Cero filas en NOTAS** — es la parte que ya venía pidiendo Nelson, y con el campo de periodo sale gratis: nunca se tocan NOTAS al clonar.

## Orden de implementación sugerido
1. Motor V2 (peso fijo) — ya prototipado en `sandbox/code.gs`.
2. Campo `PERIODO` en INDICADORES + inferencia automática al crear.
3. Filtro de periodo en los 3 reportes.
4. Reporte de Nota Final Anual.
5. Acción de clonado de indicadores.

Cada paso se prueba en el sandbox con datos nuevos antes de pasar al siguiente, igual que se viene haciendo.
