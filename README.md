# 🎮 Biblioteca de juegos para OVA

¡Bienvenido a la ludoteca de los OVA! 🎲 Aquí los docentes exploran, prueban y eligen los juegos y las actividades que quieren para sus Objetos Virtuales de Aprendizaje.

Cada juego tiene su **demo en vivo** 🕹️ y una explicación clara de cómo funciona:

- 📖 qué es y cómo se juega,
- ✅ qué pasa si el estudiante acierta,
- ❌ qué pasa si se equivoca,
- 💡 recomendaciones para el docente (cuántas preguntas, cuántas opciones, qué cuidar).

## 🧩 ¿Qué hay en el catálogo?

| Tipo               | Cuántos | Cómo son                                         |
| ------------------ | ------- | ------------------------------------------------ |
| 🎮 **Juegos**      | 23      | Con ambientación, puntos y animaciones           |
| 📝 **Actividades** | 11      | Sobrias, para practicar y comprobar un contenido |

En la página de inicio se puede 🔎 buscar por texto y filtrar por tipo y por categoría.

Y lo mejor: la galería es **independiente** 🦸. Los juegos y los componentes que necesitan viven en este repositorio, con su propio diseño. No depende del repositorio `core` de las OVA.

## 🚀 Puesta en marcha

```bash
git clone git@github.com:bb-frontend-leader/ova-games-lib.git
cd ova-games-lib
npm install
npm run dev
```

| Comando           | Qué hace                         |
| ----------------- | -------------------------------- |
| `npm run dev`     | 🔥 Servidor de desarrollo        |
| `npm run build`   | 📦 Revisa tipos y genera `dist/` |
| `npm run lint`    | 🧹 ESLint                        |
| `npm run preview` | 👀 Sirve el build de producción  |

🎨 El formato lo controla Prettier (`.prettierrc`); para revisarlo: `npx prettier --check src`. ESLint ordena las importaciones: `npx eslint src --fix` las corrige.

📂 La aplicación usa `HashRouter` y `base: './'`, así que el build funciona desde cualquier carpeta o subruta de un servidor estático, sin configurar reescrituras.

## 🗺️ Catálogo

### 🎮 Juegos

| Categoría    | Juego                                   | Ruta                                  |
| ------------ | --------------------------------------- | ------------------------------------- |
| ❓ Preguntas | 🏀 Encesta la Respuesta Correcta        | `/juegos/baloncesto`                  |
| ❓ Preguntas | 💰 Elige y Gana                         | `/juegos/elige-y-gana`                |
| ❓ Preguntas | 🧠 Desafía tu Conocimiento              | `/juegos/desafio-de-conocimiento`     |
| ❓ Preguntas | 🏎️ Carrera del Conocimiento             | `/juegos/carrera`                     |
| ❓ Preguntas | 🚀 Misión Espacial                      | `/juegos/mision-espacial`             |
| ❓ Preguntas | 🤔 ¿Cuál Prefieres?                     | `/juegos/cual-prefieres`              |
| ❓ Preguntas | 🎰 Apuesta Inteligente                  | `/juegos/apuesta-inteligente`         |
| ❓ Preguntas | 🛑 Paradas del Saber                    | `/juegos/paradas-del-saber`           |
| ❓ Preguntas | 🎡 La Ruleta del Saber                  | `/juegos/ruleta`                      |
| ❓ Preguntas | 🏆 El Tablero del Saber (Jeopardy)      | `/juegos/tablero-de-preguntas`        |
| ❓ Preguntas | 🔵 Plinko del Saber                     | `/juegos/plinko`                      |
| ❓ Preguntas | 🏰 Castillo del Saber                   | `/juegos/castillo`                    |
| ❓ Preguntas | 🧱 Construye la Respuesta               | `/juegos/construye-la-respuesta`      |
| ❓ Preguntas | 🤑 Quién quiere ser millonario          | `/juegos/quien-quiere-ser-millonario` |
| ❓ Preguntas | 🍒 Tragamonedas del Saber               | `/juegos/tragamonedas`                |
| ❓ Preguntas | 💣 Buscaminas del Saber                 | `/juegos/buscaminas`                  |
| ❓ Preguntas | ⚓ Batalla Naval del Saber              | `/juegos/batalla-naval`               |
| ❓ Preguntas | 🏗️ Torre de Bloques del Saber           | `/juegos/torre-de-bloques`            |
| ❓ Preguntas | 🔐 Escape Room del Saber                | `/juegos/escape-room`                 |
| 🔤 Palabras  | 🎈 Globos de Palabras: Ordena y Aprende | `/juegos/globos`                      |
| 🔤 Palabras  | 🤿 Rescate Submarino de Letras          | `/juegos/rescate-submarino`           |
| 🔤 Palabras  | 🎣 Pesca Correcta                       | `/juegos/pesca`                       |
| 🃏 Memoria   | 🧩 Desafío de Memoria                   | `/juegos/memoria`                     |

### 📝 Actividades

| Categoría     | Actividad                               | Ruta                                                   |
| ------------- | --------------------------------------- | ------------------------------------------------------ |
| ☑️ Selección  | Selección única                         | `/actividades/seleccion-unica`                         |
| ☑️ Selección  | Selección múltiple                      | `/actividades/seleccion-multiple`                      |
| ☑️ Selección  | Verdadero o falso                       | `/actividades/verdadero-o-falso`                       |
| ☑️ Selección  | Verdadero o falso con retroalimentación | `/actividades/verdadero-o-falso-con-retroalimentacion` |
| ☑️ Selección  | Listas desplegables                     | `/actividades/listas-desplegables`                     |
| ✍️ Completar  | Completar con texto                     | `/actividades/completar-con-texto`                     |
| ✍️ Completar  | Crucigrama                              | `/actividades/crucigrama`                              |
| 🔗 Relacionar | Arrastrar y soltar                      | `/actividades/arrastrar-y-soltar`                      |
| 🔗 Relacionar | Vincular conceptos                      | `/actividades/vincular-conceptos`                      |
| 🔗 Relacionar | Parejas con listas                      | `/actividades/parejas-con-listas`                      |
| 🔗 Relacionar | Conexiones Lógicas                      | `/actividades/conexiones-logicas`                      |

🧭 Las rutas son en español, en minúsculas y con guiones. Las rutas antiguas (`/gameBasketball`, `/allGames`…) redirigen a las nuevas (ver `LEGACY_ROUTES` en `src/routers/AppRouter.tsx`).

## 🏗️ Estructura

```
public/
└─ assets/
   ├─ base/favicon/   🎲 Favicon (SVG, PNG e ICO), apple-touch-icon y manifest
   ├─ images/         🖼️ Portadas del catálogo (imgsGames/) y otras imágenes
   └─ sound/          🔊 Sonidos de los juegos
src/
├─ activities/   📝 Actividades: radio, checkbox, true-false, table-true-false, select, select-group, input, crossword, dnd, relation-concept y pair-logic
├─ components/
│  ├─ ui/        🧱 Button, Modal, ModalFeedback, Panel, ValidationStatus, pantalla completa
│  └─ …          🏠 AppLayout, GameCard, GamePage, GameActions, Stage, ResultModals (la galería)
├─ constants/    🔔 Sonidos (SOUNDS)
├─ data/         📚 dataGames.tsx: catálogo (título, resumen, categoría, portada)
├─ games/        🎮 Un directorio por juego, más lib/fx (efectos con GSAP)
├─ hooks/        🪝 useCanAnimate, useDeferredResult, usePlaySound, useLang, …
├─ pages/        📄 home.tsx (catálogo) y una página por juego (game*.tsx) y por actividad (activity*.tsx)
├─ routers/      🛣️ AppRouter.tsx (rutas con carga diferida)
├─ styles/       🎨 tokens.css (colores, tipografía) y base.css (base y utilidades)
└─ utils/        🔧 Utilidades
```

🛠️ **Stack:** React 18, TypeScript, Vite 6, `react-router-dom` 7, GSAP, CSS Modules y la librería `books-ui` (que usan algunas pantallas de inicio de los juegos).

🎨 **Colores y estilo:** el diseño sale de `src/styles/tokens.css`. Los juegos y componentes solo leen esas variables (`--primary-*`, `--accent-*`, `--success`, `--wrong`, `--fs-*`…). Para cambiar la paleta basta editar ese archivo.

♿ **Accesibilidad:** los juegos respetan «reducir movimiento» del sistema (`useCanAnimate`): sin animaciones entregan el resultado al instante.

## ➕ Agregar un juego al catálogo

Sirve igual para juegos y actividades; la diferencia es el prefijo de la ruta (`/juegos/nombre` o `/actividades/nombre`, en minúsculas y con guiones) y el campo `kind` (`'game'` o `'activity'`).

1. 🖼️ Agregue la portada en `public/assets/images/imgsGames/` (996 × 566 px).
2. 📚 Agregue una entrada en `src/data/dataGames.tsx` (`link`, `kind`, `title`, `description`, `url`, `alt` y `category`).
3. 📄 Cree la página con `GamePage`. De `link` salen el título y el resumen; usted aporta `description`, `correct`, `incorrect` y `recommendations` (todas obligatorias), y el juego como contenido. Use `Stage` para centrar el contenido (no use `Row`/`Col`: su ancho cambia con la pantalla) y `ResultModals` para los modales de acierto y error.
4. 🛣️ Registre la ruta, con `lazy`, en `src/routers/AppRouter.tsx`.

👋 Si el juego tiene pantalla de inicio (`.Init`), póngala en su propia sección: un `Panel` con una `Panel.Section` para `Init` y otra para el juego (mire cualquier página de `src/pages/game*.tsx`).

## 📥 Traer un juego nuevo del core

¿Salió un juego nuevo en `625-OVAs-2027/core` (carpeta `components/games`)? Se copia a mano:

1. 📁 Copie el directorio del juego a `src/games/` (o la actividad a `src/activities/`).
2. 🔌 Ajuste sus importaciones a los módulos locales: `@/hooks`, `@/constants`, `@/utils`, `@/components/ui` y `@/games/lib/fx`.
3. 🌐 Reemplace `useOvaStore((s) => s.lang)` por `useLang()`, y quite lo que no se use aquí (audio, intérprete, gamificación). Los juegos de preguntas del core más recientes traen `QuestionMedia` (audio e intérprete de la pregunta): quite su import y su etiqueta, y el `extends QuestionMediaFields` de los tipos.
4. 📐 Si el juego usa `Row`/`Col` de `books-ui` por dentro, cámbielos por contenedores simples: con ellos el juego queda angosto.
5. 🎨 Si el CSS usa clases `hud-*` del core, cámbielas por `surface`, `tag` o `rule` (ver `base.css`).
6. ➕ Siga los pasos de «Agregar un juego al catálogo».
7. ✅ Compruebe con `npx prettier --check src`, `npx eslint src`, `npx tsc -b` y `npm run build`.

🚫 Del core no están en la galería: `game-phrase-and-image` (se excluyó a propósito) y `game-circular-quiz` (aún no se ha traído).

## ❤️ Hecho con el 💙 en Books&Books  

Nos enorgullece desarrollar este proyecto como parte del compromiso de **Books&Books** con la educación y la innovación tecnológica. 🌟🏆💪  

Gracias por visitar nuestro proyecto. ¡Juntos podemos hacer del aprendizaje una experiencia increíble! 🥳✨🎉🚀  