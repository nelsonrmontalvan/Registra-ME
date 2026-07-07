# Sandbox de pruebas — RegistraME

Copia aislada de `code.gs` + `index.html` para probar el fix del motor de cálculo (ver [../docs/analisis-motor-calificacion.md](../docs/analisis-motor-calificacion.md)) y mejoras visuales, **sin ningún riesgo sobre producción**.

## Cómo activarlo (una sola vez)

1. **Copiar el Sheets de producción**: en `RegistraME DB V3.0`, `Archivo → Hacer una copia`. Te va a dar un Sheets nuevo con su propio ID (lo ves en la URL: `.../spreadsheets/d/ESTE_ID_ES_EL_QUE_NECESITAS/edit`).
2. **Abrir Apps Script de esa copia**: `Extensiones → Apps Script` — esto crea un proyecto de Apps Script nuevo, separado del de producción, ligado solo a la copia.
3. Pegar el contenido de `sandbox/code.gs` en ese editor (reemplazando lo que venga por defecto).
4. En este archivo (`sandbox/code.gs`), reemplazar `PEGAR_AQUI_EL_ID_DE_TU_COPIA_DEL_SHEETS` por el ID que sacaste en el paso 1, y volver a pegarlo en Apps Script.
5. `Implementar → Nueva implementación → Aplicación web` → esto te da una URL nueva, distinta a la de producción.
6. En `sandbox/index.html`, reemplazar `PEGAR_AQUI_LA_URL_DE_TU_NUEVA_IMPLEMENTACION` por esa URL.
7. Abrir `sandbox/index.html` en el navegador (doble clic, o servirlo local) — ya estás trabajando 100% aislado de producción.

## Reglas de este sandbox

- Todo lo que se pruebe acá (fix del motor de cálculo, cambios visuales) se prueba primero acá, nunca directo en producción.
- Cuando algo quede validado y se decida adoptarlo, se traslada manualmente al `code.gs`/`index.html` reales de la raíz del repo (mismo proceso de copiar y pegar que ya conocés).
- Los datos de este Sheets copia se van a desactualizar respecto a producción con el tiempo — si necesitás datos frescos para probar, repetí el paso 1.
