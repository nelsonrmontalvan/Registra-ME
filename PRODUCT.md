# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existente: app de una sola página en `index.html` (Tailwind por CDN, Font Awesome, Inter) servida por Google Apps Script, con `code.gs` como backend. Los datos de cada cliente viven en su propio Google Sheets. Lo nuevo se prueba primero en `sandbox/` y solo lo validado pasa a los archivos principales (ver `docs/contexto-proyecto.md`).

## Product

RegistraME V-Pro es el registro del docente para el sistema educativo costarricense (MEP): asistencia por lección, calificación según las reglas del MEP (cotidiano, tareas, pruebas, proyecto), nota final con bitácora de correcciones, alertas tempranas y permanencia, expediente por estudiante, horarios, planeamientos y reportes oficiales (Informe SEA, boletas, cuadros en PDF/Excel).

Frente a llevarlo en Excel: las reglas del MEP de calificación, asistencia y alerta temprana ya vienen incorporadas, el docente no rehace fórmulas cada periodo, toda corrección queda trazada y los datos siguen en el Google Sheets del propio docente.

## Users

- **Principal:** cualquier docente con estudiantes bajo normativa MEP, de cualquier nivel o materia.
- **Escena de uso:** por igual en el celular durante la lección (pasar lista, calificar rápido, avisos) y en la computadora en casa o en el centro (planeamiento, notas, reportes, cierre de periodo).
- **Secundario:** rol administrador (usuarios, auditoría, avisos de soporte).

## Distribution

Producto de pago (V-Pro) que se vende a docentes individuales. Cada cliente conecta su propio Google Sheets.

## Constraints

- Las reglas de calificación, asistencia y alertas siguen la normativa MEP guardada en el repo (reglamento de evaluación 2026, lineamientos 2025, protocolo de permanencia 2022, catálogo de alerta temprana UPRE). La interfaz no puede contradecirla.
- Notas y asistencia son registros oficiales: las correcciones guardan motivo e historial y nada se sobrescribe sin dejar rastro.
- Debe funcionar en celular y en computadora con las mismas funciones.

## Voice

Español de Costa Rica, cercano y directo con el docente (voseo en notas internas). Usa la terminología MEP tal cual: persona estudiante, cotidiano, periodo, SEA, alerta temprana.

## Brand assets

- Nombre: RegistraME V-Pro.
- Marca: birrete en caja redondeada, versiones suave y sólida (`assets/logo/`).
- Color de marca: terracota `#C96442` sobre fondo crema `#F0EEE6`. Detalle en `docs/brand-assets.md`.

## Open decisions

- Meta de accesibilidad no declarada (se asume WCAG 2.1 AA).
