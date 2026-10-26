/** Puntos del juego. */
export const SCORE = {
  /** Por acertar a la primera y al reintentar tras una tormenta. */
  answer: 10,
  retry: 5,
  /** Extra por racha: cada acierto seguido suma `streakStep` hasta `streakCap` veces. */
  streakStep: 2,
  streakCap: 4,
  /** Bono de una isla con cofre y por llegar a la isla del tesoro. */
  chest: 10,
  treasure: 50
} as const;

/** Duración (ms) de la travesía hasta la isla (o de la tormenta): el resultado se entrega al terminarla. */
export const SAIL_MS = { ok: 2500, ko: 2600 } as const;

const NAMES = {
  es: [
    'Isla Calavera',
    'Isla del Cangrejo',
    'Isla Coral',
    'Isla Niebla',
    'Isla Palma',
    'Isla Tortuga',
    'Isla del Faro',
    'Isla Sirena',
    'Isla Volcán',
    'Isla Gaviota',
    'Isla del Loro',
    'Isla Ancla',
    'Isla Marea',
    'Isla Arrecife',
    'Isla Perla',
    'Isla Brújula'
  ],
  en: [
    'Skull Isle',
    'Crab Isle',
    'Coral Isle',
    'Fog Isle',
    'Palm Isle',
    'Turtle Isle',
    'Lighthouse Isle',
    'Mermaid Isle',
    'Volcano Isle',
    'Gull Isle',
    'Parrot Isle',
    'Anchor Isle',
    'Tide Isle',
    'Reef Isle',
    'Pearl Isle',
    'Compass Isle'
  ]
};

/** Nombre de la isla número `n` (desde 1): la lista se repite con un número si hay más islas que nombres. */
export const islandName = (lang: 'es' | 'en', n: number) => {
  const list = NAMES[lang];
  const round = Math.floor((n - 1) / list.length);

  return `${list[(n - 1) % list.length]}${round ? ` ${round + 1}` : ''}`;
};

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    map: 'Mapa del tesoro con islas y rutas',
    port: 'Puerto',
    treasure: 'Isla del tesoro',
    ship: 'Su barco',
    island: (n: number) => `Isla ${n}`,
    state: { visited: 'explorada', open: 'ruta abierta', locked: 'sin ruta todavía', chest: 'con cofre' },
    routeTitle: 'Trace su rumbo',
    routeText: 'Elija en el mapa una isla con ruta abierta: cada una esconde una pregunta.',
    left: (n: number) => (n === 1 ? 'Queda 1 isla por explorar.' : `Quedan ${n} islas por explorar.`),
    finaleText: '¡Todas las islas exploradas! Su barco pone rumbo al tesoro…',
    answers: 'Respuestas',
    discarded: 'ya descartada',
    pick: 'Elija una respuesta',
    check: 'Zarpar',
    sailing: 'Navegando…',
    change: 'Cambiar de rumbo',
    next: 'Seguir navegando',
    retry: 'Reintentar esta isla',
    toTreasure: '¡Rumbo al tesoro!',
    hud: { score: 'Puntos', streak: 'Racha', islands: 'Islas', chests: 'Cofres' },
    verdict: { ok: '¡Isla conquistada!', ko: '¡Tormenta!' },
    okHint: 'Su barco llega a la isla y planta la bandera.',
    okChest: '¡Había un cofre en la isla! Bono de 10 puntos.',
    okLast: '¡Era la última isla! Solo falta encontrar el tesoro.',
    koHint: 'La tormenta frena el barco y esa respuesta queda descartada. Reintente esta isla o cambie de rumbo.',
    legend: {
      label: 'Cómo se navega',
      open: 'Ruta abierta: elija esa isla',
      visited: 'Isla explorada',
      chest: 'Cofre: bono de puntos',
      storm: 'Fallo: tormenta'
    },
    live: {
      route: 'Elija una isla con ruta abierta.',
      island: (n: number, name: string, chest: boolean) =>
        `${name}, isla ${n}${chest ? ', con cofre' : ''}. Responda la pregunta.`,
      ok: (points: number) => `Correcta. Su barco llega a la isla. Gana ${points} puntos.`,
      chest: 'Había un cofre: bono de puntos.',
      last: 'Era la última isla: solo falta el tesoro.',
      ko: 'Incorrecta. La tormenta frena el barco y la respuesta queda descartada.',
      treasure: '¡Tesoro encontrado! El cofre se abre.'
    },
    summary: {
      title: ['¡Capitán legendario!', '¡Gran explorador!', '¡Marinero valiente!', '¡Tesoro encontrado!'],
      text: [
        'Casi todas las islas a la primera: ninguna tormenta pudo con su rumbo.',
        'Exploró todo el mapa con muy buen pulso.',
        'Exploró todo el mapa: algunas tormentas, pero siguió navegando.',
        'Exploró todo el mapa a base de insistir. ¡Vale la pena navegar otra vez!'
      ],
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      storms: 'Tormentas',
      chests: 'Cofres',
      again: 'Navegar otra vez'
    },
    init: {
      title: 'Mapa del tesoro',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Cada isla del mapa esconde una pregunta, y en algún lugar hay un tesoro.',
        'Elija a qué isla navegar: solo puede ir a las que tienen una ruta abierta desde alguna isla ya explorada o desde el puerto.',
        'Responda la pregunta y pulse «Zarpar»: si acierta, su barco llega, planta la bandera y abre nuevas rutas.',
        'Si falla, una tormenta frena el barco y esa respuesta queda descartada: puede reintentar la isla o cambiar de rumbo.',
        'Algunas islas guardan un cofre con bono de puntos, y los aciertos seguidos suman racha.',
        'Cuando explore todas las islas, su barco navega a la isla del tesoro.'
      ],
      back: 'Volver',
      start: '¡Zarpar!'
    }
  },
  en: {
    map: 'Treasure map with islands and routes',
    port: 'Harbor',
    treasure: 'Treasure island',
    ship: 'Your ship',
    island: (n: number) => `Island ${n}`,
    state: { visited: 'explored', open: 'route open', locked: 'no route yet', chest: 'with chest' },
    routeTitle: 'Chart your course',
    routeText: 'Pick an island with an open route on the map: each one hides a question.',
    left: (n: number) => (n === 1 ? '1 island left to explore.' : `${n} islands left to explore.`),
    finaleText: 'Every island explored! Your ship sets sail for the treasure…',
    answers: 'Answers',
    discarded: 'already ruled out',
    pick: 'Pick an answer',
    check: 'Set sail',
    sailing: 'Sailing…',
    change: 'Change course',
    next: 'Keep sailing',
    retry: 'Try this island again',
    toTreasure: 'Course for the treasure!',
    hud: { score: 'Score', streak: 'Streak', islands: 'Islands', chests: 'Chests' },
    verdict: { ok: 'Island conquered!', ko: 'Storm!' },
    okHint: 'Your ship reaches the island and plants the flag.',
    okChest: 'There was a chest on the island! Bonus of 10 points.',
    okLast: 'That was the last island! Only the treasure is left.',
    koHint: 'The storm slows the ship and that answer is ruled out. Try this island again or change course.',
    legend: {
      label: 'How to sail',
      open: 'Open route: pick that island',
      visited: 'Explored island',
      chest: 'Chest: bonus points',
      storm: 'Wrong: storm'
    },
    live: {
      route: 'Pick an island with an open route.',
      island: (n: number, name: string, chest: boolean) =>
        `${name}, island ${n}${chest ? ', with a chest' : ''}. Answer the question.`,
      ok: (points: number) => `Correct. Your ship reaches the island. You win ${points} points.`,
      chest: 'There was a chest: bonus points.',
      last: 'That was the last island: only the treasure is left.',
      ko: 'Wrong. The storm slows the ship and the answer is ruled out.',
      treasure: 'Treasure found! The chest opens.'
    },
    summary: {
      title: ['Legendary captain!', 'Great explorer!', 'Brave sailor!', 'Treasure found!'],
      text: [
        'Almost every island on the first try: no storm could stop you.',
        'You explored the whole map with a steady hand.',
        'You explored the whole map: some storms, but you kept sailing.',
        'You explored the whole map by sticking with it. Worth sailing again!'
      ],
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      storms: 'Storms',
      chests: 'Chests',
      again: 'Sail again'
    },
    init: {
      title: 'Treasure map',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'Every island on the map hides a question, and somewhere there is a treasure.',
        'Pick which island to sail to: you can only go to those with an open route from an explored island or from the harbor.',
        'Answer the question and press “Set sail”: if you are right, your ship arrives, plants the flag and opens new routes.',
        'If you are wrong, a storm slows the ship and that answer is ruled out: you can try the island again or change course.',
        'Some islands hold a chest with bonus points, and correct answers in a row add streak points.',
        'When you have explored every island, your ship sails to the treasure island.'
      ],
      back: 'Back',
      start: 'Set sail!'
    }
  }
};

/** Confeti de la llegada, monedas del cofre, espuma de la estela y gotas de la tormenta. */
export const FX_COLORS = ['#ffd24a', '#ffffff', '#7fe3a5', '#ff7a59', '#9fd8ff'] as const;
export const COIN_COLORS = ['#ffd24a', '#ffb703', '#fff3b0', '#ffe27a'] as const;
export const FOAM_COLORS = ['#ffffff', '#d6f1ff', '#9fd8ff'] as const;
export const STORM_COLORS = ['#9fb4c9', '#6f8aa6', '#ffffff'] as const;
