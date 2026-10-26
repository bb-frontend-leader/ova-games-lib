const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    board: (pos: number, goal: number, ladders: number, snakes: number) =>
      `Tablero de serpientes y escaleras: casilla ${pos} de ${goal}, con ${plural(ladders, 'escalera', 'escaleras')} y ${plural(snakes, 'serpiente', 'serpientes')}`,
    start: 'Salida',
    goal: 'Meta',
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    retry: 'Reintentar',
    roll: 'Tirar el dado',
    goRoll: 'Ir al dado',
    rolling: 'Tirando…',
    rollBonus: 'Tirar otra vez',
    follow: 'Seguir',
    climb: 'Subir',
    slide: 'Deslizarse',
    advance: 'Avanzar',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', cell: 'Casilla', solved: 'Preguntas', shield: 'Escudo' },
    shieldOf: (n: number) => (n ? 'Listo' : 'Sin escudo'),
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    okHint: '¡Buen camino! Has ganado una tirada de dado.',
    okShield: 'Racha de tres: ganas un escudo contra la próxima serpiente.',
    okLast: '¡Era la última pregunta! Un último impulso te lleva hasta la meta.',
    koHint: 'Esa respuesta queda descartada: sin acierto no hay tirada. Inténtalo otra vez.',
    dieLabel: (n: number) => `Dado: ${n}`,
    dieIdle: 'Dado sin tirar',
    rollTitle: '¡A tirar el dado!',
    rollText: 'Acertaste: el dado dice cuántas casillas avanzas. Un 6 te da otra tirada.',
    bonusTitle: '¡Tirada extra!',
    bonusText: 'Sacaste un 6: tira otra vez sin responder ninguna pregunta.',
    stops: {
      ladder: { title: '¡Escalera!', text: (from: number, to: number) => `Subes de la casilla ${from} a la ${to}.` },
      snake: {
        title: '¡Serpiente!',
        text: (from: number, to: number) => `Te muerde en la casilla ${from} y resbalas hasta la ${to}.`
      },
      shield: {
        title: '¡Escudo!',
        text: 'La serpiente no puede morderte: el escudo se gasta y te quedas donde estás.'
      },
      bounce: {
        title: '¡Rebote!',
        text: 'La meta aún no se abre: faltan preguntas por acertar. Te pasas y rebotas hacia atrás.'
      },
      final: { title: '¡Meta!', text: '¡Última pregunta acertada! Cruzas la meta.' }
    },
    legend: {
      label: 'Casillas especiales',
      ladder: 'Escalera: sube',
      snake: 'Serpiente: baja',
      six: 'Un 6: tiras otra vez',
      shield: 'Racha de 3: escudo'
    },
    live: {
      question: (n: number) => `Pregunta ${n}.`,
      ok: (points: number) => `Correcta. Ganas ${points} puntos y una tirada de dado.`,
      okShield: (points: number) => `Correcta. Ganas ${points} puntos, una tirada de dado y un escudo.`,
      okLast: (points: number) => `Correcta. Ganas ${points} puntos. Era la última pregunta: vas hasta la meta.`,
      ko: 'Incorrecta. La respuesta queda descartada.',
      rolled: (n: number) => `Sacas un ${n}.`,
      moving: 'Avanzando.',
      stop: (title: string, text: string) => `${title} ${text}`,
      roll: 'Tira el dado.'
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      title: '¡Llegaste a la meta!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      rolls: 'Tiradas',
      ladders: 'Escaleras subidas',
      snakes: 'Serpientes que mordieron',
      shields: 'Escudos usados',
      again: 'Jugar otra vez'
    },
    init: {
      title: 'Serpientes y escaleras',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Recorres el tablero de la salida a la meta. Cada pregunta que aciertas te da una tirada de dado.',
        'El dado dice cuántas casillas avanzas. Si fallas, esa respuesta se descarta y tienes que intentarlo otra vez.',
        'Si caes en el pie de una escalera, subes hasta su extremo. Si caes en la cabeza de una serpiente, resbalas hasta su cola.',
        'Un 6 en el dado te da otra tirada sin responder pregunta.',
        'Tres aciertos seguidos te dan un escudo: la próxima serpiente no te muerde.',
        'La meta solo se cruza al acertar la última pregunta: ese último acierto te lleva hasta ella.'
      ],
      back: 'Volver',
      start: '¡A jugar!'
    }
  },
  en: {
    board: (pos: number, goal: number, ladders: number, snakes: number) =>
      `Snakes and ladders board: square ${pos} of ${goal}, with ${plural(ladders, 'ladder', 'ladders')} and ${plural(snakes, 'snake', 'snakes')}`,
    start: 'Start',
    goal: 'Goal',
    question: 'Question',
    of: 'of',
    check: 'Check',
    retry: 'Try again',
    roll: 'Roll the die',
    goRoll: 'Go to the die',
    rolling: 'Rolling…',
    rollBonus: 'Roll again',
    follow: 'Continue',
    climb: 'Climb',
    slide: 'Slide down',
    advance: 'Move on',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', cell: 'Square', solved: 'Questions', shield: 'Shield' },
    shieldOf: (n: number) => (n ? 'Ready' : 'No shield'),
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    okHint: 'Good going! You have earned a die roll.',
    okShield: 'Streak of three: you earn a shield against the next snake.',
    okLast: 'That was the last question! One last push takes you to the goal.',
    koHint: 'That answer is ruled out: no correct answer, no roll. Try again.',
    dieLabel: (n: number) => `Die: ${n}`,
    dieIdle: 'Die not rolled',
    rollTitle: 'Roll the die!',
    rollText: 'Correct: the die says how many squares you move. A 6 gives you another roll.',
    bonusTitle: 'Extra roll!',
    bonusText: 'You rolled a 6: roll again without answering any question.',
    stops: {
      ladder: { title: 'Ladder!', text: (from: number, to: number) => `You climb from square ${from} to ${to}.` },
      snake: {
        title: 'Snake!',
        text: (from: number, to: number) => `It bites you on square ${from} and you slide down to ${to}.`
      },
      shield: { title: 'Shield!', text: 'The snake cannot bite you: the shield is spent and you stay where you are.' },
      bounce: {
        title: 'Bounce!',
        text: 'The goal is not open yet: there are questions left to answer. You overshoot and bounce back.'
      },
      final: { title: 'Goal!', text: 'Last question answered! You cross the finish line.' }
    },
    legend: {
      label: 'Special squares',
      ladder: 'Ladder: up',
      snake: 'Snake: down',
      six: 'A 6: roll again',
      shield: 'Streak of 3: shield'
    },
    live: {
      question: (n: number) => `Question ${n}.`,
      ok: (points: number) => `Correct. You win ${points} points and a die roll.`,
      okShield: (points: number) => `Correct. You win ${points} points, a die roll and a shield.`,
      okLast: (points: number) => `Correct. You win ${points} points. Last question: you go to the goal.`,
      ko: 'Wrong. That answer is ruled out.',
      rolled: (n: number) => `You roll a ${n}.`,
      moving: 'Moving.',
      stop: (title: string, text: string) => `${title} ${text}`,
      roll: 'Roll the die.'
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      title: 'You reached the goal!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      rolls: 'Rolls',
      ladders: 'Ladders climbed',
      snakes: 'Snake bites',
      shields: 'Shields used',
      again: 'Play again'
    },
    init: {
      title: 'Snakes and ladders',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'You travel the board from the start to the goal. Every question you get right earns you a die roll.',
        'The die says how many squares you move. If you get it wrong, that answer is ruled out and you must try again.',
        'If you land at the foot of a ladder, you climb to its top. If you land on a snake’s head, you slide down to its tail.',
        'A 6 on the die gives you another roll without answering a question.',
        'Three correct answers in a row give you a shield: the next snake cannot bite you.',
        'You only cross the goal by answering the last question: that last answer takes you there.'
      ],
      back: 'Back',
      start: "Let's play!"
    }
  }
};

export { plural };

/** Puntos del juego. */
export const SCORE = {
  /** Por acertar a la primera y al reintentar. */
  answer: 10,
  retry: 5,
  /** Extra por racha: cada acierto seguido suma `streakStep` hasta `streakCap` veces. */
  streakStep: 2,
  streakCap: 4,
  /** Por subir una escalera y por cruzar la meta. */
  ladder: 10,
  goal: 50
} as const;

/** Casillas del tablero por pregunta (las tiradas medias son 3,5) y mínimo de casillas. */
export const CELLS_PER_QUESTION = 5;
export const MIN_CELLS = 14;

/** Cada cuántos aciertos seguidos se gana un escudo. */
export const STREAK_SHIELD = 3;

/**
 * Escaleras y serpientes: dónde empiezan (fracción del recorrido), cuántas filas suben o bajan y cuánto se tuercen
 * (en casillas). Las escaleras empiezan en su pie y las serpientes en su cabeza.
 */
export const LADDERS = [
  { at: 0.06, rows: 2, shift: 1 },
  { at: 0.2, rows: 1, shift: -2 },
  { at: 0.4, rows: 2, shift: 2 },
  { at: 0.62, rows: 1, shift: 1 },
  { at: 0.78, rows: 1, shift: -1 }
];

export const SNAKES = [
  { at: 0.3, rows: 2, shift: 2 },
  { at: 0.5, rows: 2, shift: -2 },
  { at: 0.68, rows: 2, shift: 1 },
  { at: 0.84, rows: 2, shift: -1 },
  { at: 0.92, rows: 3, shift: 2 }
];

/** Tablero de la pantalla de inicio: casillas de la meta y casilla en la que está la ficha. */
export const INIT_GOAL = 24;
export const INIT_POS = 11;

/** Confeti del acierto y destellos de la meta. */
export const FX_COLORS = ['#ffd24a', '#ffffff', '#7fe3a5', '#ff7a59', '#9fd8ff'] as const;
export const GOAL_COLORS = ['#fff3b0', '#ffc933', '#ffffff', '#7fe3a5', '#ff8a3d'] as const;
export const SNAKE_COLORS = ['#7fe3a5', '#2e9e5b', '#ffffff'] as const;
