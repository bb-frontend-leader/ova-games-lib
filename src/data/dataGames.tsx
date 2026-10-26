export type GameKind = 'game' | 'activity';
export type GameCategory = 'questions' | 'words' | 'memory' | 'select' | 'complete' | 'relate';

export interface Game {
  /** Ruta de la página. */
  link: string;
  /** Juego (con ambientación y animaciones) o actividad (más sobria, para reforzar un contenido). */
  kind: GameKind;
  title: string;
  description: string;
  /** Imagen de portada para la tarjeta del catálogo. */
  url: string;
  alt: string;
  category: GameCategory;
}

export const kinds: { id: GameKind; label: string; singular: string; hint: string }[] = [
  { id: 'game', label: 'Juegos', singular: 'Juego', hint: 'Con ambientación, puntos y animaciones' },
  {
    id: 'activity',
    label: 'Actividades',
    singular: 'Actividad',
    hint: 'Sobrias, para practicar y comprobar un contenido'
  }
];

export const categories: { id: GameCategory; kind: GameKind; label: string; hint: string }[] = [
  { id: 'questions', kind: 'game', label: 'Preguntas', hint: 'El estudiante elige la respuesta correcta' },
  { id: 'words', kind: 'game', label: 'Palabras', hint: 'El estudiante arma frases o palabras' },
  { id: 'memory', kind: 'game', label: 'Memoria', hint: 'El estudiante descubre y empareja cartas' },
  { id: 'select', kind: 'activity', label: 'Selección', hint: 'El estudiante marca o elige la respuesta' },
  { id: 'complete', kind: 'activity', label: 'Completar', hint: 'El estudiante escribe la respuesta' },
  { id: 'relate', kind: 'activity', label: 'Relacionar', hint: 'El estudiante une o arrastra elementos' }
];

export const getKindLabel = (id: GameKind) => kinds.find((kind) => kind.id === id)?.label ?? '';

export const getKindSingular = (id: GameKind) => kinds.find((kind) => kind.id === id)?.singular ?? '';

export const getCategoryLabel = (id: GameCategory) => categories.find((category) => category.id === id)?.label ?? '';

export const games: Game[] = [
  {
    link: '/juegos/globos',
    kind: 'game',
    title: 'Globos de Palabras: Ordena y Aprende',
    description: 'Sumérgete en un mundo de diversión con nuestro juego de globos.',
    url: 'assets/images/imgsGames/balloons.png',
    alt: 'Globos de colores con palabras para ordenar una frase',
    category: 'words'
  },
  {
    link: '/juegos/baloncesto',
    kind: 'game',
    title: 'Encesta la Respuesta Correcta',
    description: '¡Demuestra tu puntería! Selecciona la respuesta correcta y encesta el balón en el tablero.',
    url: 'assets/images/imgsGames/basketball.png',
    alt: 'Cancha de baloncesto con opciones de respuesta',
    category: 'questions'
  },
  {
    link: '/juegos/rescate-submarino',
    kind: 'game',
    title: 'Rescate Submarino de Letras',
    description: '¡Sumérgete al fondo del mar y descubre la palabra escondida en las botellas!',
    url: 'assets/images/imgsGames/botles.png',
    alt: 'Fondo del mar con botellas que contienen letras',
    category: 'words'
  },
  {
    link: '/juegos/elige-y-gana',
    kind: 'game',
    title: 'Elige y Gana',
    description: '¡Elige bien y gana la recompensa! Selecciona la respuesta correcta y atrapa el premio.',
    url: 'assets/images/imgsGames/money.png',
    alt: 'Personaje frente a opciones de respuesta con un premio en dinero',
    category: 'questions'
  },
  {
    link: '/juegos/desafio-de-conocimiento',
    kind: 'game',
    title: 'Desafía tu Conocimiento',
    description: 'Pon a prueba lo que sabes y demuestra que puedes elegir la mejor respuesta.',
    url: 'assets/images/imgsGames/question.png',
    alt: 'Tarjeta con una pregunta y cuatro opciones de respuesta',
    category: 'questions'
  },
  {
    link: '/juegos/carrera',
    kind: 'game',
    title: 'Carrera del Conocimiento',
    description: 'Acelera tu mente, responde con precisión y llega primero a la meta.',
    url: 'assets/images/imgsGames/raceCard.png',
    alt: 'Pista de carreras con dos autos',
    category: 'questions'
  },
  {
    link: '/juegos/mision-espacial',
    kind: 'game',
    title: 'Misión Espacial',
    description: 'Prepárate para despegar, supera cada desafío y conquista el espacio con tu conocimiento.',
    url: 'assets/images/imgsGames/space.png',
    alt: 'Astronauta en el espacio con opciones de respuesta',
    category: 'questions'
  },
  {
    link: '/juegos/cual-prefieres',
    kind: 'game',
    title: '¿Cuál Prefieres?',
    description: 'Analiza las opciones y elige con seguridad… solo una es la correcta.',
    url: 'assets/images/imgsGames/thisOrThat.png',
    alt: 'Dos opciones de respuesta para una pregunta',
    category: 'questions'
  },
  {
    link: '/juegos/apuesta-inteligente',
    kind: 'game',
    title: 'Apuesta Inteligente',
    description: 'Apuesta por tu conocimiento, responde correctamente y multiplica tus puntos.',
    url: 'assets/images/imgsGames/casino.png',
    alt: 'Mesa de casino con fichas de apuesta y opciones de respuesta',
    category: 'questions'
  },
  {
    link: '/juegos/pesca',
    kind: 'game',
    title: 'Pesca Correcta',
    description: 'Observa con atención, pesca la respuesta correcta.',
    url: 'assets/images/imgsGames/fish.png',
    alt: 'Fondo del mar con peces que llevan palabras',
    category: 'words'
  },
  {
    link: '/juegos/memoria',
    kind: 'game',
    title: 'Desafío de Memoria',
    description: 'Descubre, memoriza y empareja correctamente para completar el desafío.',
    url: 'assets/images/imgsGames/memoryCard.png',
    alt: 'Cuadrícula de cartas de memoria boca abajo',
    category: 'memory'
  },
  {
    link: '/juegos/paradas-del-saber',
    kind: 'game',
    title: 'Paradas del Saber',
    description: 'Cada parada es un reto… responde correctamente y continúa tu camino hacia la victoria.',
    url: 'assets/images/imgsGames/stopCard.png',
    alt: 'Camino con paradas, cada una con una pregunta',
    category: 'questions'
  },
  {
    link: '/juegos/ruleta',
    kind: 'game',
    title: 'La Ruleta del Saber',
    description: 'Gira la ruleta, responde la pregunta que salga y suma puntos con comodines y rachas.',
    url: 'assets/images/imgsGames/roulette.png',
    alt: 'Ruleta de colores con casillas numeradas',
    category: 'questions'
  },
  {
    link: '/juegos/tablero-de-preguntas',
    kind: 'game',
    title: 'El Tablero del Saber',
    description:
      'Elige casillas de un tablero por categorías: más puntos, más difícil. ¿Te animas con la apuesta doble?',
    url: 'assets/images/imgsGames/jeopardy.png',
    alt: 'Tablero de categorías con casillas de puntos',
    category: 'questions'
  },
  {
    link: '/juegos/plinko',
    kind: 'game',
    title: 'Plinko del Saber',
    description: 'Cada acierto gana una ficha para soltar sobre los clavos: ¿hasta qué premio llegará?',
    url: 'assets/images/imgsGames/plinko.png',
    alt: 'Tablero de clavos con una ficha cayendo hacia los premios',
    category: 'questions'
  },
  {
    link: '/juegos/castillo',
    kind: 'game',
    title: 'Castillo del Saber',
    description: 'Elige el bloque con la respuesta correcta para que el héroe abra la puerta del castillo.',
    url: 'assets/images/imgsGames/castle.png',
    alt: 'Castillo con un héroe frente a la puerta y bloques con respuestas',
    category: 'questions'
  },
  {
    link: '/juegos/construye-la-respuesta',
    kind: 'game',
    title: 'Construye la Respuesta',
    description: 'Completa el modelo de piezas de colores eligiendo la pieza que encaja con la respuesta correcta.',
    url: 'assets/images/imgsGames/lego.png',
    alt: 'Modelo de piezas de colores al que le falta una pieza',
    category: 'questions'
  },
  {
    link: '/juegos/quien-quiere-ser-millonario',
    kind: 'game',
    title: 'Quién quiere ser millonario',
    description: 'Responde una pregunta tras otra y suma un millón por cada acierto.',
    url: 'assets/images/imgsGames/millions.png',
    alt: 'Pregunta con cuatro respuestas y un contador de dinero acumulado',
    category: 'questions'
  },
  {
    link: '/juegos/catapulta',
    kind: 'game',
    title: 'Catapulta del Saber',
    description: 'Cada acierto gana una piedra: elige el ángulo y la fuerza y derriba la torre enemiga.',
    url: 'assets/images/imgsGames/catapult.png',
    alt: 'Catapulta lanzando una piedra contra una torre enemiga',
    category: 'questions'
  },
  {
    link: '/juegos/cometas',
    kind: 'game',
    title: 'Cometas de Agosto',
    description: 'Cada acierto sube la cometa un peldaño; cuidado con las ráfagas de viento.',
    url: 'assets/images/imgsGames/cometa.png',
    alt: 'Cometa de colores subiendo por el cielo con una cola de lazos',
    category: 'questions'
  },
  {
    link: '/juegos/carrera-de-carriles',
    kind: 'game',
    title: 'Carrera de Carriles',
    description: 'Cada respuesta es un carril: elige el correcto y corre hacia la meta contra tres rivales.',
    url: 'assets/images/imgsGames/laneRace.png',
    alt: 'Pista con varios carriles y un coche de carreras',
    category: 'questions'
  },
  {
    link: '/juegos/loteria',
    kind: 'game',
    title: 'Lotería del Saber',
    description: 'El cantor lee una pista y tú marcas la carta correcta en tu tabla.',
    url: 'assets/images/imgsGames/loteria.png',
    alt: 'Tabla de lotería con cartas ilustradas y frijoles',
    category: 'questions'
  },
  {
    link: '/juegos/escalada',
    kind: 'game',
    title: 'Escalada de Montaña',
    description: 'Cada acierto sube un tramo del sendero; administra tus fuerzas hasta la cumbre.',
    url: 'assets/images/imgsGames/mountainClimb.png',
    alt: 'Montaña con un sendero, campamentos y una cumbre nevada',
    category: 'questions'
  },
  {
    link: '/juegos/parques',
    kind: 'game',
    title: 'Parqués del Saber',
    description: 'Cada acierto da una tirada de dados: lleva tus fichas al cielo antes que el rival.',
    url: 'assets/images/imgsGames/parques.png',
    alt: 'Tablero de parqués con fichas amarillas y rojas y dos dados',
    category: 'questions'
  },
  {
    link: '/juegos/rana',
    kind: 'game',
    title: 'Rana del Saber',
    description: 'Cada acierto da una moneda para lanzar a la mesa de rana: ¿entrará en la boca?',
    url: 'assets/images/imgsGames/rana.png',
    alt: 'Mesa de rana con la rana, el molino, el puente y la tortuga',
    category: 'questions'
  },
  {
    link: '/juegos/serpientes-y-escaleras',
    kind: 'game',
    title: 'Serpientes y Escaleras del Saber',
    description: 'Cada acierto da una tirada de dado: sube por las escaleras y esquiva las serpientes.',
    url: 'assets/images/imgsGames/snakesLadders.png',
    alt: 'Tablero de serpientes y escaleras con una ficha y un dado',
    category: 'questions'
  },
  {
    link: '/juegos/tejo',
    kind: 'game',
    title: 'Tejo del Saber',
    description: 'Cada acierto da un tejo para lanzar a la caja de arcilla: apunta al bocín y revienta la mecha.',
    url: 'assets/images/imgsGames/tejo.png',
    alt: 'Cancha de tejo con la caja de arcilla, el bocín y las mechas',
    category: 'questions'
  },
  {
    link: '/juegos/mapa-del-tesoro',
    kind: 'game',
    title: 'Mapa del Tesoro',
    description: 'Cada isla esconde una pregunta: navega por el mapa hasta encontrar el tesoro.',
    url: 'assets/images/imgsGames/treasureMap.png',
    alt: 'Mapa con islas, rutas, un barco y un cofre del tesoro',
    category: 'questions'
  },
  {
    link: '/juegos/tragamonedas',
    kind: 'game',
    title: 'Tragamonedas del Saber',
    description: 'Acierta para ganar tiradas de la máquina y busca los tres diamantes del jackpot.',
    url: 'assets/images/imgsGames/slots.png',
    alt: 'Máquina tragamonedas con tres carretes',
    category: 'questions'
  },
  {
    link: '/juegos/buscaminas',
    kind: 'game',
    title: 'Buscaminas del Saber',
    description: 'Despeja las casillas seguras respondiendo preguntas y esquiva las minas escondidas.',
    url: 'assets/images/imgsGames/minesweeper.png',
    alt: 'Campo de casillas con minas escondidas',
    category: 'questions'
  },
  {
    link: '/juegos/batalla-naval',
    kind: 'game',
    title: 'Batalla Naval del Saber',
    description: 'Cada respuesta correcta es un disparo: encuentra y hunde la flota enemiga.',
    url: 'assets/images/imgsGames/navalBattle.png',
    alt: 'Mar cuadriculado con barcos enemigos escondidos',
    category: 'questions'
  },
  {
    link: '/juegos/torre-de-bloques',
    kind: 'game',
    title: 'Torre de Bloques del Saber',
    description: 'Construye la torre colocando con la grúa un bloque por cada respuesta correcta.',
    url: 'assets/images/imgsGames/towerBlocks.png',
    alt: 'Grúa colocando un bloque sobre una torre',
    category: 'questions'
  },
  {
    link: '/juegos/escape-room',
    kind: 'game',
    title: 'Escape Room del Saber',
    description: 'Abre los candados con tus respuestas y descubre el código para escapar de la sala.',
    url: 'assets/images/imgsGames/escapeRoom.png',
    alt: 'Sala con objetos con candado y una puerta con código',
    category: 'questions'
  },
  {
    link: '/actividades/seleccion-unica',
    kind: 'activity',
    title: 'Selección única',
    description: 'Elige la única respuesta correcta entre varias opciones.',
    url: 'assets/images/imgsGames/activityRadio.png',
    alt: 'Pregunta con opciones de selección única',
    category: 'select'
  },
  {
    link: '/actividades/seleccion-multiple',
    kind: 'activity',
    title: 'Selección múltiple',
    description: 'Marca todas las opciones que son correctas.',
    url: 'assets/images/imgsGames/activityCheckbox.png',
    alt: 'Pregunta con casillas de selección múltiple',
    category: 'select'
  },
  {
    link: '/actividades/verdadero-o-falso',
    kind: 'activity',
    title: 'Verdadero o falso',
    description: 'Decide si cada enunciado es verdadero o falso.',
    url: 'assets/images/imgsGames/activityTrueFalse.png',
    alt: 'Enunciados con botones de verdadero y falso',
    category: 'select'
  },
  {
    link: '/actividades/verdadero-o-falso-con-retroalimentacion',
    kind: 'activity',
    title: 'Verdadero o falso con retroalimentación',
    description: 'Responde cada enunciado y recibe una explicación al instante.',
    url: 'assets/images/imgsGames/activityTableTrueFalse.png',
    alt: 'Tabla de enunciados con explicación de cada respuesta',
    category: 'select'
  },
  {
    link: '/actividades/listas-desplegables',
    kind: 'activity',
    title: 'Listas desplegables',
    description: 'Elige en cada lista el concepto que corresponde.',
    url: 'assets/images/imgsGames/activitySelect.png',
    alt: 'Frases con listas desplegables para elegir el concepto',
    category: 'select'
  },
  {
    link: '/actividades/completar-con-texto',
    kind: 'activity',
    title: 'Completar con texto',
    description: 'Escribe la respuesta correcta en cada campo.',
    url: 'assets/images/imgsGames/activityInput.png',
    alt: 'Frase con campos de texto para completar',
    category: 'complete'
  },
  {
    link: '/actividades/crucigrama',
    kind: 'activity',
    title: 'Crucigrama',
    description: 'Resuelve las pistas y completa el crucigrama.',
    url: 'assets/images/imgsGames/activityCrossword.png',
    alt: 'Crucigrama con pistas horizontales y verticales',
    category: 'complete'
  },
  {
    link: '/actividades/arrastrar-y-soltar',
    kind: 'activity',
    title: 'Arrastrar y soltar',
    description: 'Arrastra cada elemento al lugar que le corresponde.',
    url: 'assets/images/imgsGames/activityDnd.png',
    alt: 'Elementos para arrastrar hasta su descripción',
    category: 'relate'
  },
  {
    link: '/actividades/vincular-conceptos',
    kind: 'activity',
    title: 'Vincular conceptos',
    description: 'Une cada concepto con su definición.',
    url: 'assets/images/imgsGames/activityRelationConcept.png',
    alt: 'Tarjetas de conceptos y definiciones para vincular',
    category: 'relate'
  },
  {
    link: '/actividades/parejas-con-listas',
    kind: 'activity',
    title: 'Parejas con listas',
    description: 'Forma cada pareja eligiendo en dos listas.',
    url: 'assets/images/imgsGames/activitySelectGroup.png',
    alt: 'Dos columnas de listas para formar parejas',
    category: 'relate'
  },
  {
    link: '/actividades/conexiones-logicas',
    kind: 'activity',
    title: 'Conexiones Lógicas',
    description: 'Cada elemento tiene su complemento… ¿podrás encontrar todas las conexiones correctas?',
    url: 'assets/images/imgsGames/PairLogicItems.png',
    alt: 'Imágenes de animales y los textos que deben relacionarse',
    category: 'relate'
  }
];

export const getGame = (link: string) => games.find((game) => game.link === link);
