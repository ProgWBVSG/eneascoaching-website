# Skill: Generador de Carruseles High-Ticket (React + Exportación PNG)

## 🎯 Objetivo de esta Skill
Instruir a Claude/ChatGPT para generar un presentador de carruseles de Instagram (1080x1350px) enfocado en ventas high-ticket, con branding técnico/autoridad, y que incluya una función real para exportar los slides a imágenes PNG.

## 📐 Estructura Técnica y UI
- **Stack**: React (Vite), Tailwind CSS, iconos de `lucide-react` y animaciones sutiles.
- **Canvas de Exportación**: Renderizar un contenedor oculto con medidas estables de 1080x1350px. Usar la librería `html-to-image` con `pixelRatio: 2` para asegurar que la exportación sea en Alta Resolución.
- **Exportación**: Botón "Exportar Todo" que itere sobre cada slide y fuerce la descarga automática al usuario.

## 🎨 Branding y Diseño (Estilos MYB Digitals)
- **Tema Visual**: Estilo "Dark Tech". Colores principales: Fondo Azul Noche (`#0A1628`), Blanco puro y acentos en Cyan Neón (`#00F0FF`).
- **Fondos Pro**: Alternar entre slides oscuros y claros. Añadir de fondo un patrón de cuadrícula sutil (grid opacity 0.03) y halos de luz (blurs) cyan en las esquinas.
- **Logo (Robotito)**: En la esquina superior derecha debe ir SIEMPRE el isotipo. Un recuadro cyan con un icono de robot (`<Bot />` de Lucide) en azul oscuro, seguido del texto "MYB Digitals" con fuente display bold (tamaño sobre 40px).
- **Tipografía**: Títulos gigantes (fonts de >60px, números clave encima de 120px) para atrapar el scroll. Textos alineados a la izquierda para mejor legibilidad.
- **Formatos**: Insignias (badges) redondos para separar conceptos ("Error #1" en rojo, o "Nosotros ✅" en cyan).

## ✍️ Copywriting (Estructura de la Opción 1)
- **Slide 1**: Gancho numérico gigante (ej. "90%").
- **Slides 2-4**: El Problema de la industria (destacar en rojo, iconos ❌).
- **Slides 5-7**: La Solución MYB Digitals (destacar en cyan, iconos ✅).
- **Slide 8**: Casos reales con "Antes y Después" resaltados.
- **Slide 9**: La garantía libre de riesgo con icono de escudo (`<ShieldCheck />`).
- **Slide 10**: CTA gigante (Mandar DM).

## 📄 Output esperado de la IA:
Debes generar todo el código de React directamente integrando los slides hardcodeados y la función estricta de exportación a PNG lista para ser usada.
