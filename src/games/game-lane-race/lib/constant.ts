const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    road: 'Pista con un carril por respuesta',
    laneLabel: (n: number) => `Carril ${n}`,
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    retry: 'Reintentar',
    next: 'Siguiente pregunta',
    results: 'Ver resultados',
    driving: 'Acelerando…',
    pick: 'Elige un carril',
    hud: { score: 'Puntos', streak: 'Racha', rank: 'Puesto', nitro: 'Turbos', solved: 'Preguntas' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: '¡Choque!' },
    okHint: '¡Vía libre! Tu coche pasa por la puerta y suma un tramo.',
    okNitro: 'Racha de tres: ¡turbo! Ganas medio tramo extra.',
    okLast: '¡Era la última pregunta! Tu coche cruza la meta.',
    koHint: 'Ese carril estaba bloqueado: la respuesta queda descartada. Elige otro carril.',
    rankOf: (rank: number, cars: number) => `${rank}.º de ${cars}`,
    rankWord: (rank: number) => `${rank}.º puesto`,
    you: 'Tú',
    rivalName: (n: number) => `Rival ${n}`,
    strip: {
      label: 'Posiciones de la carrera',
      car: (name: string, tramo: string) => `${name}: ${tramo}`,
      tramos: (n: number, total: number) => `${plural(Math.min(Math.floor(n), total), 'tramo', 'tramos')} de ${total}`,
      start: 'Salida',
      goal: 'Meta'
    },
    legend: {
      label: 'Cómo va la carrera',
      lane: 'Cada carril es una respuesta',
      ok: 'Acierto: pasas y avanzas',
      ko: 'Fallo: choque y carril bloqueado',
      nitro: 'Racha de 3: turbo'
    },
    live: {
      question: (n: number) => `Pregunta ${n}.`,
      lane: (n: number) => `Carril ${n} elegido.`,
      ok: (points: number) => `Correcta. Ganas ${points} puntos y tu coche avanza.`,
      okNitro: (points: number) => `Correcta. Ganas ${points} puntos, y la racha de tres te da un turbo.`,
      okLast: (points: number) => `Correcta. Ganas ${points} puntos. Era la última pregunta: cruzas la meta.`,
      ko: 'Choque. Ese carril estaba bloqueado y la respuesta queda descartada.',
      rank: (rank: number, cars: number) => `Vas ${rank}.º de ${cars}.`
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      title: [
        '¡Ganaste la carrera!',
        '¡Segundo puesto en el podio!',
        '¡Tercer puesto en el podio!',
        'Cruzaste la meta'
      ],
      text: [
        'Cruzaste la meta antes que todos los rivales.',
        'Solo un rival llegó antes que tú.',
        'Dos rivales te adelantaron, pero subiste al podio.',
        'Los rivales te adelantaron, pero completaste todas las preguntas.'
      ],
      score: 'Puntos',
      rank: 'Puesto',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      crashes: 'Choques',
      nitros: 'Turbos',
      again: 'Correr otra vez'
    },
    init: {
      title: 'Carrera de carriles',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Cada pregunta es una puerta al final de la pista, y cada carril lleva una respuesta.',
        'Elige el carril de la respuesta que creas correcta (con el ratón, el teclado o el dedo) y pulsa «Comprobar»: tu coche acelera hacia la puerta.',
        'Si aciertas, la puerta se abre y avanzas un tramo. Si fallas, chocas: ese carril queda bloqueado y debes elegir otro.',
        'Los rivales avanzan con cada respuesta que compruebas, acierte o no: cuantos menos choques, mejor puesto.',
        'Tres aciertos seguidos te dan un turbo: medio tramo extra.',
        'La carrera acaba al acertar todas las preguntas: el último acierto te lleva a la meta y se reparte el podio.'
      ],
      back: 'Volver',
      start: '¡A correr!'
    }
  },
  en: {
    road: 'Track with one lane per answer',
    laneLabel: (n: number) => `Lane ${n}`,
    question: 'Question',
    of: 'of',
    check: 'Check',
    retry: 'Try again',
    next: 'Next question',
    results: 'See results',
    driving: 'Accelerating…',
    pick: 'Pick a lane',
    hud: { score: 'Score', streak: 'Streak', rank: 'Place', nitro: 'Nitros', solved: 'Questions' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Crash!' },
    okHint: 'Clear road! Your car goes through the gate and gains a stretch.',
    okNitro: 'Streak of three: nitro! You gain half a stretch extra.',
    okLast: 'That was the last question! Your car crosses the finish line.',
    koHint: 'That lane was blocked: the answer is ruled out. Pick another lane.',
    rankOf: (rank: number, cars: number) => `${rank}/${cars}`,
    rankWord: (rank: number) => `Place ${rank}`,
    you: 'You',
    rivalName: (n: number) => `Rival ${n}`,
    strip: {
      label: 'Race positions',
      car: (name: string, stretch: string) => `${name}: ${stretch}`,
      tramos: (n: number, total: number) =>
        `${plural(Math.min(Math.floor(n), total), 'stretch', 'stretches')} of ${total}`,
      start: 'Start',
      goal: 'Finish'
    },
    legend: {
      label: 'How the race works',
      lane: 'Each lane is an answer',
      ok: 'Correct: you pass and advance',
      ko: 'Wrong: crash and lane blocked',
      nitro: 'Streak of 3: nitro'
    },
    live: {
      question: (n: number) => `Question ${n}.`,
      lane: (n: number) => `Lane ${n} chosen.`,
      ok: (points: number) => `Correct. You win ${points} points and your car moves on.`,
      okNitro: (points: number) => `Correct. You win ${points} points, and the streak of three gives you a nitro.`,
      okLast: (points: number) => `Correct. You win ${points} points. Last question: you cross the finish line.`,
      ko: 'Crash. That lane was blocked and the answer is ruled out.',
      rank: (rank: number, cars: number) => `You are ${rank} of ${cars}.`
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      title: [
        'You won the race!',
        'Second place on the podium!',
        'Third place on the podium!',
        'You crossed the finish line'
      ],
      text: [
        'You crossed the line ahead of every rival.',
        'Only one rival got there before you.',
        'Two rivals passed you, but you made the podium.',
        'The rivals passed you, but you answered every question.'
      ],
      score: 'Score',
      rank: 'Place',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      crashes: 'Crashes',
      nitros: 'Nitros',
      again: 'Race again'
    },
    init: {
      title: 'Lane race',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'Each question is a gate at the end of the track, and every lane carries an answer.',
        'Pick the lane of the answer you think is right (with the mouse, the keyboard or your finger) and press “Check”: your car speeds towards the gate.',
        'If you are right, the gate opens and you move on a stretch. If you are wrong, you crash: that lane is blocked and you must pick another.',
        'The rivals move on with every answer you check, right or wrong: the fewer crashes, the better your place.',
        'Three correct answers in a row give you a nitro: half a stretch extra.',
        'The race ends when every question is answered: the last right answer takes you to the finish and the podium is handed out.'
      ],
      back: 'Back',
      start: "Let's race!"
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
  /** Por el turbo y por ganar la carrera. */
  nitro: 10,
  win: 50
} as const;

/** Cada cuántos aciertos seguidos se gana un turbo, y cuánto avance da (en tramos). */
export const STREAK_NITRO = 3;
export const NITRO_BONUS = 0.5;

/**
 * Los rivales: color y ritmo medio (tramos por respuesta comprobada, nunca más de 1). Con cero choques el jugador
 * llega siempre primero; cada choque deja a los rivales ganar terreno.
 */
export const RIVALS = [
  { color: '#2a7de1', pace: 0.82 },
  { color: '#2fa66a', pace: 0.9 },
  { color: '#8e5bd6', pace: 0.97 }
] as const;

export const PLAYER_COLOR = '#e5383b';

/** Duración (ms) del trayecto del coche hasta la puerta: el resultado se entrega al terminarlo. */
export const DRIVE_MS = 1900;

/** Confeti del acierto y de la meta; humo del choque. */
export const FX_COLORS = ['#ffd24a', '#ffffff', '#7fe3a5', '#ff7a59', '#9fd8ff'] as const;
export const GOAL_COLORS = ['#fff3b0', '#ffc933', '#ffffff', '#ff5a4a', '#2a7de1'] as const;
export const SMOKE_COLORS = ['#c9ced6', '#8c93a0', '#ffffff'] as const;
