# Biblioteca de juegos para OVA

Galería donde los docentes exploran, prueban y eligen los juegos y las actividades que usarán en sus Objetos Virtuales de Aprendizaje (OVA). Cada uno tiene su demo en vivo y una explicación de cómo funciona: descripción, qué pasa si el estudiante acierta, qué pasa si falla y recomendaciones para el docente (cuántas preguntas, cuántas opciones, qué cuidar).

El catálogo distingue dos tipos: **juegos** (con ambientación, puntos y animaciones) y **actividades** (sobrias, para practicar y comprobar un contenido).

La aplicación es **independiente**: los juegos y los componentes que necesitan viven en este repositorio, con su propio diseño. No depende del repositorio `core` de las OVA.

## Puesta en marcha

```bash
git clone git@github.com:bb-frontend-leader/ova-games-lib.git
cd ova-games-lib
npm install
npm run dev
```

| Comando           | Qué hace                      |
| ----------------- | ----------------------------- |
| `npm run dev`     | Servidor de desarrollo        |
| `npm run build`   | Revisa tipos y genera `dist/` |
| `npm run lint`    | ESLint                        |
| `npm run preview` | Sirve el build de producción  |

## Estructura

```
src/
├─ activities/   Actividades: radio, checkbox, true-false, table-true-false, select, select-group, input, crossword, dnd, relation-concept y pair-logic
├─ components/
│  ├─ ui/        Button, Modal, ModalFeedback, Panel, ValidationStatus, pantalla completa
│  └─ …          AppLayout, GameCard, GamePage, GameActions, Stage, ResultModals (la galería)
├─ constants/    Sonidos (SOUNDS)
├─ data/         dataGames.tsx: catálogo (título, resumen, categoría, portada)
├─ games/        Un directorio por juego, más lib/fx (efectos con GSAP)
├─ hooks/        useCanAnimate, useDeferredResult, usePlaySound, useLang, …
├─ pages/        home.tsx (catálogo) y una página por juego (game*.tsx) y por actividad (activity*.tsx)
├─ routers/      AppRouter.tsx (rutas con carga diferida)
├─ styles/       tokens.css (colores, tipografía) y base.css (base y utilidades)
└─ utils/
```

El diseño sale de `src/styles/tokens.css`: los juegos y componentes solo leen esas variables (`--primary-*`, `--accent-*`, `--success`, `--wrong`, `--fs-*`…). Para cambiar la paleta basta editar ese archivo.

## Agregar un juego al catálogo

Sirve igual para juegos y actividades; la diferencia es el prefijo de la ruta (`/juegos/nombre` o `/actividades/nombre`, en minúsculas y con guiones) y el campo `kind` (`'game'` o `'activity'`).

1. Agregue la portada en `public/assets/images/imgsGames/`.
2. Agregue una entrada en `src/data/dataGames.tsx` (`link`, `kind`, `title`, `description`, `url`, `alt` y `category`).
3. Cree la página con `GamePage`. De `link` salen el título y el resumen; usted aporta `description`, `correct`, `incorrect` y `recommendations` (todas obligatorias), y el juego como contenido. Use `Stage` para centrar el contenido (no use `Row`/`Col`: su ancho cambia con la pantalla) y `ResultModals` para los modales de acierto y error.
4. Registre la ruta, con `lazy`, en `src/routers/AppRouter.tsx`.

## Traer un juego nuevo del core

Los juegos del core se copian a mano:

1. Copie el directorio del juego a `src/games/` (o la actividad a `src/activities/`).
2. Ajuste sus importaciones a los módulos locales: `@/hooks`, `@/constants`, `@/utils`, `@/components/ui` y `@/games/lib/fx`.
3. Reemplace `useOvaStore((s) => s.lang)` por `useLang()`, y quite lo que no se use aquí (audio, intérprete, gamificación). Los juegos de preguntas del core más recientes traen `QuestionMedia` (audio e intérprete de la pregunta): quite su import y su etiqueta, y el `extends QuestionMediaFields` de los tipos.
4. Si el CSS usa clases `hud-*` del core, cámbielas por `surface`, `tag` o `rule` (ver `base.css`).
5. Siga los pasos de «Agregar un juego al catálogo».
