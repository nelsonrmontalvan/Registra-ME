# Contexto del proyecto Registra-ME

## Ubicacion

- Ruta local: `/Users/nelsonrodriguezm/Desktop/Proyectos/Registra-ME`
- Repositorio: Git conectado a GitHub mediante `origin`

## Estructura principal

- `index.html`: version principal del sitio.
- `code.gs`: backend y funciones de Google Apps Script.
- `sandbox/`: espacio exclusivo para pruebas y prototipos locales.
- `assets/`: recursos visuales y de marca.
- `docs/`: documentacion y notas tecnicas.

## Flujo de trabajo

1. Desarrollar y probar primero dentro de `sandbox/`.
2. Verificar el funcionamiento antes de promover cambios.
3. Pasar solo los cambios validados a `index.html` o a los archivos principales.
4. Revisar el estado y el diff de Git antes de publicar.
5. Hacer commit y `push` a GitHub cuando corresponda.

## Reglas

- No modificar el sitio principal durante la etapa de pruebas.
- No revertir cambios locales existentes sin revisarlos y confirmarlos.
- Mantener separados los prototipos de la version publicada.
