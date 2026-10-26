const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Puntos del juego. */
export const SCORE = {
  /** Por acertar a la primera y al reintentar. */
  answer: 10,
  retry: 5,
  /** Extra por racha: cada acierto seguido suma `streakStep` hasta `streakCap` veces. */
  streakStep: 2,
  streakCap: 4,
  /** Por dónde cae el tejo. */
  monona: 60,
  embocinada: 40,
  mecha: 30,
  mano: 10,
  /** Extra por cada lanzamiento seguido que puntúa (hasta `comboCap`). */
  combo: 5,
  comboCap: 5
} as const;

/** Pulsos firmes que se pueden tener a la vez y cada cuántos aciertos seguidos se gana uno. */
export const MAX_STEADY = 2;
export const STREAK_STEADY = 3;

/** Radios (unidades del escenario) de cada zona, medidos desde el centro del bocín o de la mecha. */
export const RADIUS = { monona: 9, bocin: 19, mecha: 12, mano: 80, mechaRing: 34 } as const;

/** Cuánto se desvía el tejo del punto apuntado (radio máximo): normal y con pulso firme. */
export const WOBBLE = { normal: 30, steady: 7 } as const;

/** Centímetros que mide cada unidad del escenario (la caja de arcilla mide unos 110 cm). */
export const CM_PER_UNIT = 0.25;

/** Sitios donde puede aparecer el bocín, como fracción del ancho y del fondo de la arcilla. */
export const SPOTS = [
  [0.5, 0.5],
  [0.3, 0.38],
  [0.7, 0.38],
  [0.3, 0.7],
  [0.7, 0.7],
  [0.5, 0.28],
  [0.5, 0.74]
] as const;

/** Pantalla de inicio: bocín en el centro y sin lanzamientos previos. */
export const INIT_SPOT = 0;

/** Confeti del acierto, polvo de la arcilla y chispas de la mecha. */
export const FX_COLORS = ['#fcd116', '#ffffff', '#ce1126', '#4d8dff', '#7fe3c8'] as const;
export const DEBRIS_COLORS = ['#b58a68', '#8f6a4d', '#d6b394', '#6f4f38'] as const;
export const BLAST_COLORS = ['#ff7a1a', '#ffc233', '#fff3b0', '#ff4d2e'] as const;

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    stage: (throws: number) =>
      `Caja de tejo vista desde arriba, con el bocín al centro de la arcilla. Tejos lanzados: ${throws}.`,
    boom: '¡BUM!',
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    load: 'Tomar el tejo',
    retry: 'Reintentar',
    fire: '¡Lanzar!',
    nextQuestion: 'Siguiente pregunta',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', steady: 'Pulso', scored: 'Buenos' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    okHint: '¡Ganó un tejo! Tómelo y apunte al bocín.',
    koHint: 'Esa respuesta queda descartada. Sin respuesta correcta no hay tejo: inténtelo otra vez.',
    okSteady: 'Racha de tres: ganó un pulso firme.',
    aim: {
      title: '¡Apunte y lance!',
      text: 'Toque la arcilla o use los deslizadores para elegir dónde cae el tejo. El círculo punteado muestra cuánto puede desviarse.',
      x: 'De izquierda a derecha',
      y: 'De cerca a lejos',
      value: (n: number) => `${n} por ciento`,
      steady: 'Pulso firme',
      steadyHint: 'Casi no se desvía: el tejo cae donde usted apunta.',
      steadyOn: 'Pulso firme activado.',
      zones: 'Puntos según dónde caiga',
      last: (text: string) => `Último tejo: ${text}`
    },
    zones: {
      monona: 'Moñona',
      embocinada: 'Embocinada',
      mecha: 'Mecha',
      mano: 'Mano'
    },
    result: {
      monona: '¡Moñona!',
      embocinada: '¡Embocinada!',
      mecha: '¡Mecha reventada!',
      mano: '¡Mano!',
      clay: 'Cayó en la arcilla',
      out: 'Se fue fuera de la caja',
      mononaHint: (cm: number) => `El tejo entró al bocín y reventó una mecha, a ${cm} cm del centro.`,
      embocinadaHint: (cm: number) => `El tejo quedó dentro del bocín, a ${cm} cm del centro.`,
      mechaHint: (cm: number) => `¡Bum! El tejo reventó una mecha, a ${cm} cm del bocín.`,
      manoHint: (cm: number) => `Quedó a ${cm} cm del bocín: la mano es suya.`,
      clayHint: (cm: number) => `Cayó a ${cm} cm del bocín. Apunte más cerca y use el pulso firme.`,
      outHint: 'Se pasó de la caja. Apunte dentro de la arcilla.',
      combo: (n: number) => `Tejos seguidos que puntúan: ${n}.`
    },
    live: {
      question: (n: number) => `Pregunta ${n}.`,
      ok: (points: number) => `Correcta. Gana ${points} puntos y un tejo.`,
      okSteady: 'Ganó un pulso firme.',
      ko: 'Incorrecta. La respuesta queda descartada.',
      aim: 'Apunte al bocín y lance el tejo.',
      throwing: 'Lanzando.',
      monona: (points: number) => `¡Moñona! Gana ${points} puntos.`,
      embocinada: (points: number) => `¡Embocinada! Gana ${points} puntos.`,
      mecha: (points: number) => `¡Mecha reventada! Gana ${points} puntos.`,
      mano: (points: number) => `¡Mano! Gana ${points} puntos.`,
      clay: (cm: number) => `El tejo cayó en la arcilla, a ${cm} centímetros del bocín.`,
      out: 'El tejo se fue fuera de la caja.',
      mode: (on: boolean) => (on ? 'Pulso firme activado.' : 'Pulso firme desactivado.')
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      title: '¡Se acabó la partida!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      scored: 'Tejos que puntuaron',
      bocines: 'Embocinadas',
      mechas: 'Mechas reventadas',
      bestCombo: 'Mejor racha de tejos',
      accuracy: 'Puntería',
      again: 'Jugar de nuevo'
    },
    init: {
      title: 'El tejo del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Está en una cancha de tejo: cada pregunta que acierte le da un tejo para lanzar a la caja de arcilla.',
        'Si falla, esa respuesta se descarta y puede intentarlo de nuevo. Sin acierto no hay tejo.',
        'Con el tejo, toque la arcilla o use los deslizadores para elegir dónde cae. El bocín cambia de sitio en cada pregunta y el tejo siempre se desvía un poco.',
        'Una embocinada, con el tejo dentro del bocín, da 40 puntos; una mecha reventada, 30; quedar cerca del bocín (la mano), 10; y una moñona, que es embocinar y reventar una mecha a la vez, 60.',
        'Encadenar tejos que puntúan suma un extra.',
        'Cada tres aciertos seguidos gana un pulso firme: el tejo casi no se desvía.',
        'La partida termina al acertar todas las preguntas y lanzar el último tejo.'
      ],
      back: 'Volver',
      start: '¡A lanzar!'
    }
  },
  en: {
    stage: (throws: number) =>
      `Tejo box seen from above, with the bocín in the middle of the clay. Discs thrown: ${throws}.`,
    boom: 'BOOM!',
    question: 'Question',
    of: 'of',
    check: 'Check',
    load: 'Take the disc',
    retry: 'Try again',
    fire: 'Throw!',
    nextQuestion: 'Next question',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', steady: 'Steady', scored: 'Good' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    okHint: 'You won a disc! Take it and aim at the bocín.',
    koHint: 'That answer is ruled out. No correct answer, no disc: try again.',
    okSteady: 'Streak of three: you won a steady hand.',
    aim: {
      title: 'Aim and throw!',
      text: 'Tap the clay or use the sliders to choose where the disc lands. The dotted circle shows how far it can drift.',
      x: 'Left to right',
      y: 'Near to far',
      value: (n: number) => `${n} percent`,
      steady: 'Steady hand',
      steadyHint: 'It barely drifts: the disc lands where you aim.',
      steadyOn: 'Steady hand on.',
      zones: 'Points by where it lands',
      last: (text: string) => `Last disc: ${text}`
    },
    zones: {
      monona: 'Moñona',
      embocinada: 'Embocinada',
      mecha: 'Fuse',
      mano: 'Mano'
    },
    result: {
      monona: 'Moñona!',
      embocinada: 'Embocinada!',
      mecha: 'Fuse blown!',
      mano: 'Mano!',
      clay: 'It landed in the clay',
      out: 'It went out of the box',
      mononaHint: (cm: number) => `The disc went into the bocín and blew a fuse, ${cm} cm from the centre.`,
      embocinadaHint: (cm: number) => `The disc stayed inside the bocín, ${cm} cm from the centre.`,
      mechaHint: (cm: number) => `Boom! The disc blew a fuse, ${cm} cm from the bocín.`,
      manoHint: (cm: number) => `It stopped ${cm} cm from the bocín: the mano is yours.`,
      clayHint: (cm: number) => `It landed ${cm} cm from the bocín. Aim closer and use the steady hand.`,
      outHint: 'It went past the box. Aim inside the clay.',
      combo: (n: number) => `Scoring discs in a row: ${n}.`
    },
    live: {
      question: (n: number) => `Question ${n}.`,
      ok: (points: number) => `Correct. You win ${points} points and a disc.`,
      okSteady: 'You won a steady hand.',
      ko: 'Wrong. That answer is ruled out.',
      aim: 'Aim at the bocín and throw the disc.',
      throwing: 'Throwing.',
      monona: (points: number) => `Moñona! You win ${points} points.`,
      embocinada: (points: number) => `Embocinada! You win ${points} points.`,
      mecha: (points: number) => `Fuse blown! You win ${points} points.`,
      mano: (points: number) => `Mano! You win ${points} points.`,
      clay: (cm: number) => `The disc landed in the clay, ${plural(cm, 'centimetre', 'centimetres')} from the bocín.`,
      out: 'The disc went out of the box.',
      mode: (on: boolean) => (on ? 'Steady hand on.' : 'Steady hand off.')
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      title: 'Game over!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      scored: 'Discs that scored',
      bocines: 'Embocinadas',
      mechas: 'Fuses blown',
      bestCombo: 'Best disc streak',
      accuracy: 'Accuracy',
      again: 'Play again'
    },
    init: {
      title: 'The tejo of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'You are on a tejo court: every question you get right gives you a disc to throw at the clay box.',
        'If you miss, that answer is ruled out and you can try again. No correct answer, no disc.',
        'With the disc, tap the clay or use the sliders to choose where it lands. The bocín moves for every question and the disc always drifts a little.',
        'An embocinada, with the disc inside the bocín, is worth 40 points; a blown fuse, 30; stopping near the bocín (the mano), 10; and a moñona, which is an embocinada and a blown fuse at once, 60.',
        'Chaining scoring discs earns an extra.',
        'Every three correct answers in a row you win a steady hand: the disc barely drifts.',
        'The game ends when you answer every question correctly and throw the last disc.'
      ],
      back: 'Back',
      start: "Let's throw!"
    }
  }
};
