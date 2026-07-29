# RegistraME — Fonts, Logos & Assets

Referencia de marca extraída directamente del código en producción (`index.html`), para que cualquier pieza nueva (anuncios, PDFs, mockups, video) sea consistente con lo que ya existe en la app.

## Paleta de colores

Definida en `tailwind.config` dentro de `index.html` como la escala `indigo` (el nombre es solo la clave de Tailwind — el color real es terracota, no azul/índigo):

| Clave Tailwind | Hex | Uso |
|---|---|---|
| `indigo-50` | `#FDF5F1` | Fondo de íconos/badges suaves (logo en sidebar y login) |
| `indigo-100` | `#FAEAE1` | Fondos hover muy suaves |
| `indigo-200` | `#F2CEBB` | Bordes suaves |
| `indigo-300` | `#E8AE8E` | — |
| `indigo-400` | `#DB8E68` | — |
| `indigo-500` | `#D17452` | — |
| **`indigo-600`** | **`#C96442`** | **Color primario de marca** — botones principales, badge "PRO", favicon, `theme-color` |
| `indigo-700` | `#AE5235` | Hover de botones primarios, extremo oscuro de gradientes |
| `indigo-800` | `#8C4028` | — |
| `indigo-900` | `#3D1A0F` | — |

**Fondo general de la app:** `#F0EEE6` ("Cream Canvas", inspirado en la paleta de Anthropic).

**Colores de estado** (no son de marca, son semánticos — se repiten en toda la app):
- Verde (`emerald-*` / `green-*`) → éxito, aprobado, presente.
- Rojo (`rose-*` / `red-*`) → error, reprobado, ausente injustificado, eliminar.
- Ámbar (`amber-*`) → advertencia, alertas tempranas, tardía.
- Teal (`teal-*`) → módulo de Eximidos.
- Naranja (`orange-*`) → escapadas.
- Azul/Sky (`sky-*`) → informativo, recalcular pesos.

## Tipografía

- **Fuente:** [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts), pesos 300/400/500/600/700.
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  ```
- Jerarquía típica: `text-2xl font-extrabold` para títulos principales (ej. "RegistraME V-Pro" en login), `font-bold` para subtítulos, `text-sm`/`text-xs` para cuerpo y metadatos.

## Logo / ícono de marca

En el código vive como ícono de Font Awesome (`fa-graduation-cap` 🎓) dentro de una caja redondeada, sin archivo de imagen. Para usar fuera de la app (presentaciones, Canva, etc.) ya están exportados como archivos en `assets/logo/`:

- `logo-solido.svg` / `logo-solido.png` (512×512)
- `logo-suave.svg` / `logo-suave.png` (512×512)

Dos tratamientos, según el contexto:

**1. Versión suave (UI normal — sidebar, login, tarjetas):**
```html
<div class="bg-indigo-50 rounded-xl flex items-center justify-center">
    <i class="fas fa-graduation-cap text-indigo-600"></i>
</div>
```
Fondo `#FDF5F1` (crema terracota), ícono `#C96442`.

**2. Versión sólida (favicon, marketing, modales destacados):**
```html
<div style="background:linear-gradient(135deg,#C96442,#AE5235);">
    <i class="fas fa-graduation-cap" style="color:white;"></i>
</div>
```
Gradiente `#C96442 → #AE5235`, ícono blanco. Mayor contraste para tamaños chicos (favicon) o para llamar la atención (modal "Descubre el Poder del Sistema").

**Badge "PRO":** `bg-indigo-600 text-white`, texto pequeño en mayúsculas, siempre junto al nombre "RegistraME".

## Favicon

SVG generado en línea (sin archivo externo, carga instantánea):
```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2222%22 fill=%22%23C96442%22/><text x=%2250%22 y=%2258%22 font-size=%2255%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>🎓</text></svg>">
```
Caja redondeada `#C96442` con el emoji 🎓 centrado. Mismo SVG se usa para `apple-touch-icon`.

## Imagen para redes sociales (Open Graph)

- **Archivo:** `og-image.png` (raíz del repo), 1200×630px, generado con `<canvas>` (no diseño manual).
- **Contenido:** fondo degradado crema → `#F0EEE6`, caja del logo (gradiente `#C96442`→`#AE5235` + 🎓), texto "RegistraME" en negro y "V-PRO · Gestión Educativa Integral" en `#C96442`.
- **Uso:** referenciado en `<meta property="og:image">` y `<meta name="twitter:image">` para que WhatsApp/redes muestren la marca real al compartir el link, en vez de un ícono genérico.
- URL pública: `https://registra-me.vercel.app/og-image.png`

## ⚠️ Inconsistencia detectada (pendiente de decidir)

Los **PDFs generados por el backend** (Cuadro de Materia, Ampliaciones, Historial de Cambios, Alertas Tempranas) usan un color de encabezado distinto al de marca:

```
color:#004E64   /* azul petróleo, NO es #C96442 */
```

Y el PDF de "Historial de Asistencia" (impresión directa del navegador) usa:
```
border-bottom:2px solid #16a34a;   /* verde, tampoco es de marca */
```

Ningún PDF actual usa el terracota `#C96442`. No lo cambié porque no me lo pediste — lo dejo anotado acá para que decidas si querés unificarlo en algún momento (le daría más identidad de marca a los documentos oficiales que salen de RegistraME).

## Contacto / pie de página estándar

Aparece en el footer de la app y en varios PDFs:
```
© 2026 RegistraME V-Pro. Desarrollado por Ing. Nelson Rodríguez M.
nelson.rmontalvan@gmail.com · +506 7102 3115
```

## Assets ya generados en este proyecto (para reusar, no regenerar)

- `og-image.png` — imagen de Open Graph (arriba).
- `sandbox/Videos - Registrame/` — serie de 8 videotutoriales + capturas (`dashboard.png`, `login.png`, `nuevos.jpg`).
- Ver `reference_youtube_series_urls` y `reference_marketing_alertas_tempranas` en la memoria del proyecto para los links y copy ya redactado de campañas anteriores.
