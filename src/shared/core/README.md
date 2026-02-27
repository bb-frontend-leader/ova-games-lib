# 🎓 Core - OVAS 2026

Biblioteca compartida de componentes, hooks y utilidades para proyectos OVAS (Objetos Virtuales de Aprendizaje).

## 📁 Estructura del Proyecto

```
core/
├── components/          # Componentes de React
│   ├── activities/     # Componentes de actividades interactivas
│   ├── games/          # Componentes de juegos educativos
│   └── ui/             # Componentes de interfaz general
├── hooks/              # React hooks personalizados
├── consts/             # Constantes y configuraciones
├── utils/              # Funciones utilitarias
└── styles/             # Estilos globales
```

## 🎮 Componentes

### Activities
Componentes para actividades educativas interactivas:

- **checkbox-activity** - Actividades con selección múltiple
- **crossword-input** - Crucigramas interactivos
- **dnd-activity** - Actividades de arrastrar y soltar
- **input-activity** - Actividades con campos de entrada
- **radio-activity** - Actividades con selección única
- **relation-concept-activity** - Relacionar conceptos
- **select-activity** - Actividades con selectores
- **select-group-activity** - Selección por grupos
- **this-or-that-activity** - Actividades de comparación

### Games
Juegos educativos gamificados:

- **game-ballons** - Juego de globos
- **game-bottles** - Juego de botellas
- **game-casino** - Juego estilo casino educativo
- **game-fishs** - Juego de peces
- **game-money** - Juego de dinero/economía
- **game-phraseAndImage** - Asociación de frases e imágenes
- **game-question** - Juego de preguntas
- **game-radio-basket** - Juego de canasta con radio
- **game-space** - Juego espacial

### UI Components
Componentes de interfaz de usuario generales:

- **button-download** - Botón de descarga
- **comic-viewer** - Visor de cómics
- **fullscreen-alert** - Alertas en pantalla completa
- **fullscreen-button** - Botón para pantalla completa
- **icon** - Sistema de iconos
- **math-container** - Contenedor para fórmulas matemáticas
- **memory-card** - Tarjetas de memoria
- **modal-bibliography** - Modal de bibliografía
- **modal-credits** - Modal de créditos
- **modal-feedback** - Modal de retroalimentación
- **order-phrase** - Ordenar frases
- **page-not-found** - Página 404
- **race-card** - Tarjetas de carrera/competencia
- **stop-game** - Control de detención de juegos
- **svg-positioner** - Posicionador de SVG
- **table-true-false** - Tabla verdadero/falso
- **true-false** - Componente verdadero/falso

## 🪝 Hooks

Hooks personalizados para funcionalidades comunes:

- **use-a11y-attribute** - Atributos de accesibilidad
- **use-background** - Gestión de fondos
- **use-full-screen** - Control de pantalla completa
- **use-interpreter** - Intérprete de lenguaje de señas
- **use-keyboard-shortcuts** - Atajos de teclado
- **use-reduce-motion** - Detección de preferencia de movimiento reducido
- **use-session-storage** - Almacenamiento de sesión
- **use-title** - Gestión del título de la página

## ⚙️ Utilidades

Funciones helper compartidas:

- **event-change-interpreter-video** - Eventos para cambio de video del intérprete
- **event-update-title** - Actualización de títulos
- **focus-main** - Control de foco principal
- **keyboard-shortcuts** - Gestión de atajos de teclado
- **load-css** - Carga dinámica de CSS

## 📦 Constantes

- **events** - Definición de eventos del sistema
- **key-a11y** - Teclas de accesibilidad
- **remove-html-tags-regex** - Expresiones regulares para limpieza HTML

## 🚀 Instalación

### Como Submódulo de Git

```bash
# Agregar el submódulo a tu proyecto
git submodule add <repository-url> core

# Inicializar y actualizar el submódulo
git submodule update --init --recursive
```

### Actualizar el Submódulo

```bash
# Actualizar a la última versión
git submodule update --remote core
```

## 💻 Uso

### Importar Componentes

```tsx
// Actividades
import { CheckboxActivity } from './core/components/activities/checkbox-activity'
import { DndActivity } from './core/components/activities/dnd-activity'

// Juegos
import { GameBallons } from './core/components/games/game-ballons'
import { GameBottles } from './core/components/games/game-bottles'

// UI
import { ButtonDownload } from './core/components/ui/button-download'
import { FullscreenButton } from './core/components/ui/fullscreen-button'
```

### Usar Hooks

```tsx
import { useFullScreen } from './core/hooks/use-full-screen'
import { useTitle } from './core/hooks/use-title'
import { useKeyboardShortcuts } from './core/hooks/use-keyboard-shortcuts'

function MyComponent() {
  const { isFullscreen, toggleFullscreen } = useFullScreen()
  useTitle('Mi Página')
  useKeyboardShortcuts({
    'Ctrl+F': toggleFullscreen
  })
  
  return (
    <div>
      {/* Tu contenido */}
    </div>
  )
}
```

### Usar Utilidades

```tsx
import { focusMain } from './core/utils/focus-main'
import { loadCSS } from './core/utils/load-css'

// Cargar CSS dinámicamente
loadCSS('https://example.com/styles.css')

// Enfocar elemento principal
focusMain()
```

## 🎨 Estilos

Los estilos están organizados en:
- **index.css** - Estilos base
- **stylesheet/** - Hojas de estilo modulares

Importa los estilos base en tu aplicación:

```tsx
import './core/styles/index.css'
```

## 🤝 Contribución

### Convenciones de Código

1. **Nombres de archivos**: Usar kebab-case
   - ✅ `use-title.ts`
   - ✅ `game-ballons.tsx`
   - ❌ `useTitle.ts`
   - ❌ `GameBallons.tsx`

2. **Componentes**: PascalCase para nombres de componentes
3. **Hooks**: Prefijo `use` + camelCase
4. **Utilidades**: camelCase

### Estructura de Componentes

```
component-name/
├── component-name.tsx          # Componente principal
├── component-name.module.css   # Estilos
├── index.ts                    # Exportaciones
├── types/                      # Tipos TypeScript
└── hooks/                      # Hooks específicos (opcional)
```

## 📝 Commits

Este proyecto utiliza [Commitlint](https://commitlint.js.org/) para mantener mensajes de commit consistentes.

Formato de commits:

```
type(scope): mensaje

Ejemplos:
feat(games): agregar game-math
fix(hooks): corregir use-fullscreen en móviles
docs(readme): actualizar documentación de instalación
refactor(components): reorganizar estructura de carpetas
```

## 🔧 Configuración

### TypeScript

Los proyectos que usen este core deben incluir estas configuraciones en su `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@core/*": ["./core/*"]
    }
  }
}
```

## 📄 Licencia

[Especificar licencia]

## 👥 Equipo

Desarrollado por el equipo OVAS 2026

---

Para más información o reportar problemas, contacta al equipo de desarrollo.
