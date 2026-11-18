#!/bin/zsh
# Regenera tailwind.css de RegistraME. Doble clic después de agregar clases nuevas.
cd "$(dirname "$0")"
npx -y tailwindcss@3 -i tailwind.input.css -o tailwind.css --minify
echo ""
echo "Listo: tailwind.css actualizado. Puede cerrar esta ventana."
