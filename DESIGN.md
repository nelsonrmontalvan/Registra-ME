---
name: RegistraME V-Pro
description: Registro docente MEP — cálido, claro y rápido de leer en el aula y en casa.
colors:
  terracota: "#C96442"
  terracota-hondo: "#AE5235"
  terracota-50: "#FDF5F1"
  terracota-100: "#FAEAE1"
  terracota-200: "#F2CEBB"
  crema: "#F0EEE6"
  riel: "#FBF9F5"
  superficie: "#FFFFFF"
  tinta: "#191919"
  texto: "#334155"
  texto-suave: "#64748B"
  borde: "#E2E8F0"
  exito: "#059669"
  error: "#E11D48"
  aviso: "#B45309"
  guardar: "#16A34A"
typography:
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.terracota}"
    textColor: "{colors.superficie}"
    rounded: "{rounded.lg}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.terracota-hondo}"
  button-save:
    backgroundColor: "{colors.guardar}"
    textColor: "{colors.superficie}"
    rounded: "{rounded.md}"
    padding: "8px 24px"
  card:
    backgroundColor: "{colors.superficie}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "8px"
  nav-item-active:
    backgroundColor: "{colors.terracota-100}"
    textColor: "{colors.terracota-hondo}"
    rounded: "{rounded.md}"
---

# Design System: RegistraME V-Pro

## Overview

**Creative North Star: "El cuaderno del docente"**

Un registro de trabajo diario, no un panel corporativo. Fondo crema cálido, tarjetas blancas limpias y un solo color de marca (terracota) que marca lo importante: la acción principal, la sección activa, el valor que se está editando. La densidad es media: tablas legibles de una mano en el celular y de un vistazo en la computadora.

Cada sección tiene un color propio (asistencia verde, alertas ámbar, Mi Aula teal, etc.) que vive solo en su chip de ícono y en el encabezado de la pantalla; ese color orienta, no decora el contenido.

**Key Characteristics:**
- Terracota como única voz de marca sobre crema.
- Color semántico estricto: verde = logrado o aprobado, rojo = error o reprobado, ámbar = advertencia o corrección.
- Celular de primera clase: barra inferior, ventanas tipo hoja y áreas táctiles de 44px.
- Preferencias de accesibilidad: tema claro u oscuro, fuente Atkinson Hyperlegible y tamaño de texto de 100 a 140%.

## Colors

Un acento cálido sobre neutros fríos de Tailwind (slate) y fondo crema.

### Primary
- **Terracota** (`terracota`): botones principales, ítem activo del menú, valores en edición, favicon y `theme-color`. En el código vive como `indigo-600` porque la escala `indigo` de Tailwind está remapeada a terracota.
- **Terracota hondo** (`terracota-hondo`): hover del primario y texto activo del menú.

### Neutral
- **Crema** (`crema`): fondo general de la app.
- **Riel** (`riel`): fondo del menú lateral.
- **Superficie** (`superficie`): tarjetas, tablas y modales.
- **Tinta / Texto / Texto suave** (`tinta`, `texto`, `texto-suave`): jerarquía de texto (slate).

### Named Rules
**La regla del semáforo honesto.** Verde, rojo y ámbar significan siempre lo mismo. Un campo vacío nunca va en rojo ni en verde: el vacío es gris, y el color aparece solo cuando hay un valor que lo justifica.

**La regla del color de sección.** El color de cada sección solo va en su chip de ícono (menú, título y barra inferior). No se usa en botones ni en datos.

## Typography

**Fuente:** Inter (300 a 700), con Atkinson Hyperlegible y Arial como opciones de accesibilidad mediante `--font-app`.

### Hierarchy
- **Title** (800, 1.5rem): título de pantalla, siempre con su chip de sección.
- **Headline** (700, 1.125rem): título de tarjeta o de la actividad que se califica.
- **Body** (400, 0.875rem): filas de tabla y texto.
- **Label** (700, 0.75rem, mayúsculas): encabezados de tabla y etiquetas de campo.

Las cifras de notas y porcentajes usan `tabular-nums`.

## Layout

Menú lateral fijo (claro) más contenido sobre crema en escritorio. Bajo 768px, el menú pasa a una barra inferior de 5 botones, los modales de SweetAlert suben como hojas desde abajo, los formularios de 3 o más columnas pasan a 2 y los inputs usan 16px para que iOS no haga zoom. Bajo 1024px las tablas tienen un ancho mínimo de 800px con desplazamiento lateral, salvo las que ya acomodan sus filas (Calificar).

## Elevation & Depth

Plano por defecto: las tarjetas usan `shadow-sm` y un borde sutil. Hay sombra profunda solo en modales y en el login. El chip de sección activo lleva una sombra teñida de su propio color.

## Shapes

Radios suaves: 8px en controles, 12 a 16px en tarjetas, 24px en modales y forma de píldora solo en badges y chips pequeños.

## Components

### Buttons
- **Primario:** terracota, 700, radio 12px, `active:scale-95`.
- **Guardar notas:** verde (`guardar`), reservado para confirmar registros oficiales.
- **Corregir:** ámbar suave con borde; siempre pide motivo.
- **Secundario:** fondo de tinte suave del color de su función (por ejemplo, azul claro en «Máx»).

### Inputs / Fields
- Borde slate-300, fondo blanco y foco con anillo terracota.
- Bloqueado (nota ya guardada): fondo slate-50, texto slate-700, sin opacidad. Se corrige con «Corregir».

### Navigation
- Ítems del menú con chip de color de sección de 32px; el activo se pinta con ese color y lleva un borde derecho de 3px.
- Barra inferior móvil con desenfoque de fondo y badge rojo para avisos.

## Do's and Don'ts

### Do:
- **Do** dejar los campos vacíos en gris y colorear solo cuando hay valor.
- **Do** mantener las áreas táctiles de al menos 44px en celular.
- **Do** respetar `prefers-reduced-motion` en toda animación nueva.

### Don't:
- **Don't** usar rojo como estilo por defecto de un input.
- **Don't** repetir en cada fila un texto de ayuda que puede ir en el `title` del botón.
- **Don't** introducir un segundo color de marca; las secciones ya tienen su color y la marca es solo terracota.
