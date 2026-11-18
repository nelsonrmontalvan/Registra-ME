// RegistraME — configuración de Tailwind (Fase 2 Modern Web Guidance)
// Antes vivía dentro de index.html. Si agrega clases nuevas, regenere tailwind.css
// con el archivo actualizar-css.command (doble clic) o:
//   npx tailwindcss@3 -i tailwind.input.css -o tailwind.css --minify
module.exports = {
  content: ['./index.html', './code.gs'],
  theme: {
    extend: {
      colors: {
        indigo: {
          50:  '#FDF5F1',
          100: '#FAEAE1',
          200: '#F2CEBB',
          300: '#E8AE8E',
          400: '#DB8E68',
          500: '#D17452',
          600: '#C96442',
          700: '#AE5235',
          800: '#8C4028',
          900: '#3D1A0F',
        }
      }
    }
  }
}
