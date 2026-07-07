# Análisis: Motor de Cálculo de Cotidiano — Peso Dinámico vs Peso Fijo

Fecha: 2026-07-02
Estado: análisis únicamente — no se tocó `code.gs`.

## Por qué esto importa para el negocio

RegistraME lleva 6 meses en el mercado. El activo más frágil de un producto así de nuevo no es el diseño visual — es la confianza de que **la nota que ve el profe, el estudiante y el MEP es la misma y es correcta**. El incidente de hoy (Cotidiano inflado + 3 reportes desincronizados) es exactamente el tipo de bug que, si lo detecta un profesor antes que vos, te cuesta clientes en la etapa donde más necesitás retención. Antes de agregar funciones nuevas, vale la pena decidir si el motor de cálculo aguanta escalar a más instituciones sin seguir generando este tipo de sustos.

## Estado actual (as-is)

- El peso de cada indicador de Cotidiano **no es fijo**: se recalcula en cada lectura como `peso_total_materia ÷ cantidad_de_indicadores_TRAB_COT_que_existan_en_ese_momento`.
- Existen **3 implementaciones independientes** de esta misma cuenta (Boleta, Cuadro de Materia, Reporte SEA) — hoy se encontraron 3 bugs distintos entre ellas porque cada una reimplementó la lógica por su cuenta.
- Los campos `PUNTAJE_MAX` (en INDICADORES) y `%_OBTENIDO` (en NOTAS) se guardan al calificar, pero los reportes de Cotidiano casi nunca los leen — son datos "zombie": existen, pero nada depende de que estén correctos. Por eso la corrupción de 165 filas en INDICADORES pasó desapercibida meses.

## Opción A — Mantener peso dinámico (como está hoy)

**A favor:**
- Es conceptualmente simple: "promedio de desempeño × peso total del rubro".
- No requiere migrar datos existentes.
- Si un profesor agrega más trabajo cotidiano a mitad de periodo, el peso se reparte solo, sin que tenga que hacer nada.

**En contra:**
- **Reponderación retroactiva silenciosa**: agregar o borrar un indicador cambia el valor de TODO lo ya calificado, sin que nadie lo decida explícitamente. Ya generó el bug de "suma acumulada" que se parchó una vez (sin rediseñar) y es la raíz de por qué el Cotidiano se veía distinto según cuándo se consultara.
- Un valor "cerrado" de un periodo no es realmente inmutable — si algo toca INDICADORES después de cerrar el periodo, el número histórico puede moverse. Mal encaje con un reporte oficial (SEA) que se sube al MEP y que debería ser un hecho congelado en el tiempo.
- Más difícil de auditar: no podés preguntarle a los datos "¿qué pesaba este indicador el día que se calificó?" — la respuesta depende de cuándo se hace la pregunta.

## Opción B — Fijar el peso al momento de calificar (propuesta)

**Cómo funcionaría:** cuando se guarda una calificación, el peso vigente en ese momento (`peso_total ÷ cantidad de indicadores en ese momento`) se calcula UNA vez y se guarda de forma persistente junto a la nota (reutilizando el campo `PUNTAJE_MAX`/`%_OBTENIDO`, que hoy están vacíos de propósito real). Los reportes ya no recalculan nada — solo suman lo que ya quedó guardado.

**A favor:**
- **Auditable y estable**: una nota calificada no cambia de valor por eventos posteriores. Encaja con la idea de "cerrar un periodo" como un hecho, no como una foto movediza.
- Revive los campos `PUNTAJE_MAX`/`%_OBTENIDO` con un propósito real, en vez de ser datos muertos que se corrompen sin que nadie lo note.
- Si el profesor quiere agregar indicadores nuevos y **redistribuir** el peso de los ya calificados, eso se convierte en una acción explícita ("recalcular pesos de esta materia") — visible y decidida por el profesor, no un efecto secundario invisible de cuántos indicadores existan hoy.
- Una sola función compartida (`calcularCotidianoEstudiante`) reemplaza las 3 implementaciones actuales — un bug futuro se arregla en un solo lugar.

**En contra:**
- Requiere una migración de una sola vez (congelar el peso vigente de cada nota existente) — similar en esfuerzo a la limpieza de duplicados que ya hicimos hoy.
- Hay que definir una política clara para "qué pasa si agrego un indicador a mitad de periodo" (¿se ofrece un botón de recalcular, o los nuevos indicadores simplemente toman el peso restante disponible?).

## Recomendación

Para un producto que busca monetizar más y que ya reporta a una entidad oficial (MEP vía SEA), la estabilidad y auditabilidad pesan más que la comodidad de "se reparte solo". Recomiendo la Opción B, con estas dos piezas como base:

1. Consolidar Boleta/Cuadro/SEA en una sola función de cálculo (bajo riesgo, alto impacto — elimina la clase de bug que vivimos hoy).
2. Migrar a peso fijo al calificar, con una acción explícita de "recalcular pesos" para cuando el profesor agregue indicadores después.

## Próximo paso sugerido

Antes de tocar `code.gs` real, se puede construir un prototipo/clon aislado (por ejemplo un archivo `code_v2_prototype.gs` o una copia del Sheets de prueba) que implemente la Opción B, correr ambos motores en paralelo contra los mismos datos reales, y comparar resultados — así se valida sin riesgo antes de decidir migrar producción.
