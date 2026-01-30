# Documentación del Proyecto EneasCoaching

## Estructura de Carpetas

### `/components`
Componentes reutilizables de React:
- `Button.tsx` - Botón con variantes (primary, outline)
- `Footer.tsx` - Footer del sitio con navegación y redes sociales
- `Header.tsx` - Barra de navegación principal
- `EnneagramAnimation.tsx` - Animación del símbolo del eneagrama
- Otros componentes UI

### `/pages`
Páginas principales de la aplicación:
- `Home.tsx` - Página de inicio
- `About.tsx` - Sobre Mí
- `GroupMentorship.tsx` - Mentoría Grupal
- `PremiumMentorship.tsx` - Mentoría Premium
- `Diploma.tsx` - Diplomatura en Eneagrama
- `FreeContent.tsx` - Contenido Gratuito

### `/public`
Archivos estáticos accesibles públicamente:
- `/testimonios` - Imágenes de testimonios de WhatsApp
- Otros recursos estáticos

### `/fotosCecilia`
Fotografías profesionales de Cecilia B. Sánchez

### `/scripts`
Scripts de automatización y utilidades:
- `setup_git.ps1` - Configuración inicial de Git
- `upload_to_github.ps1` - Subir cambios a GitHub

### `/directivas`
Procedimientos y directivas operacionales:
- `directiva_ejemplo.md` - Plantilla de directiva
- Otros documentos de procedimientos

### `/docs`
Documentación del proyecto:
- `style_guide.md` - Guía de estilo
- `metadata.json` - Metadata del proyecto
- `PROJECT_STRUCTURE.md` - Este archivo

## Archivos de Configuración

### Raíz del Proyecto
- `package.json` - Dependencias y scripts npm
- `tsconfig.json` - Configuración de TypeScript
- `vite.config.ts` - Configuración de Vite
- `tailwind.config.js` - Configuración de Tailwind CSS
- `.gitignore` - Archivos ignorados por Git
- `.env.example` - Ejemplo de variables de entorno

### TypeScript
- `types.ts` - Definiciones de tipos globales
- `App.tsx` - Componente principal de la aplicación
- `index.tsx` - Punto de entrada

## Flujo de Desarrollo

1. **Desarrollo Local**
   ```bash
   npm run dev
   ```

2. **Build para Producción**
   ```bash
   npm run build
   ```

3. **Preview del Build**
   ```bash
   npm run preview
   ```

## Convenciones

### Componentes
- Usar PascalCase para nombres de archivos y componentes
- Props tipadas con TypeScript
- Componentes funcionales con hooks

### Estilos
- Tailwind CSS como framework principal
- Clases customizadas en `brand-*` para colores del tema
- Responsive design (mobile-first)

### Rutas
- Usar React Router para navegación
- Rutas definidas en `App.tsx`

## Mantenimiento

### Actualizar Dependencias
```bash
npm update
```

### Verificar Tipos
```bash
npx tsc --noEmit
```

## Contacto del Desarrollador

Para preguntas técnicas o soporte, consultar con el desarrollador del proyecto.
