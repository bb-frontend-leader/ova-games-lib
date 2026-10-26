import type { HoleId } from '../types/types';

/** Puntos del juego. */
export const SCORE = {
  /** Por acertar a la primera y al reintentar. */
  answer: 10,
  retry: 5,
  /** Extra por racha: cada acierto seguido suma `streakStep` hasta `streakCap` veces. */
  streakStep: 2,
  streakCap: 4,
  /** Extra por cada moneda seguida que entra (hasta `comboCap`) y multiplicador del hoyo doble. */
  combo: 5,
  comboCap: 5,
  hot: 2
} as const;

/** Manos firmes que se pueden tener a la vez y cada cuántos aciertos seguidos se gana una. */
export const MAX_STEADY = 2;
export const STREAK_STEADY = 3;

/** Los hoyos de la mesa: puntos que da cada uno y probabilidad base de que la moneda entre. */
export const HOLES: Record<HoleId, { points: number; chance: number }> = {
  rana: { points: 50, chance: 0.2 },
  molino: { points: 30, chance: 0.35 },
  puente: { points: 25, chance: 0.45 },
  tortuga: { points: 20, chance: 0.55 },
  hoyo: { points: 10, chance: 0.75 }
};

export const HOLE_IDS = Object.keys(HOLES) as HoleId[];

/** Cómo sube la probabilidad: por cada acierto seguido (hasta `streakCap`), con mano firme, y su tope. */
export const CHANCE = { streakStep: 0.04, streakCap: 4, steady: 0.2, cap: 0.95 } as const;

/** Pantalla de inicio: la rana apuntada y el hoyo doble en el molino. */
export const INIT_AIM: HoleId = 'rana';
export const INIT_HOT: HoleId = 'molino';

/** Confeti del acierto, destellos del hoyo y chispas del rebote. */
export const FX_COLORS = ['#fcd116', '#ffffff', '#ff7aa8', '#7fe3a8', '#8fb8ff'] as const;
export const GLINT_COLORS = ['#fff3a8', '#fcd116', '#ffffff', '#ffb347'] as const;
export const BOUNCE_COLORS = ['#c9a050', '#e8c66a', '#9a7a30', '#f2e3b0'] as const;

const pct = (chance: number) => Math.round(chance * 100);

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    stage: (throws: number, hot: string) =>
      `Mesa de rana vista de frente, con la rana arriba y el molino, el puente, la tortuga y los hoyos debajo. Hoyo doble de este turno: ${hot}. Monedas lanzadas: ${throws}.`,
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    load: 'Tomar la moneda',
    retry: 'Reintentar',
    fire: '¡Lanzar!',
    nextQuestion: 'Siguiente pregunta',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', steady: 'Mano', scored: 'Dentro' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    okHint: '¡Ganó una moneda! Tómela y elija el hoyo.',
    koHint: 'Esa respuesta queda descartada. Sin respuesta correcta no hay moneda: inténtelo otra vez.',
    okSteady: 'Racha de tres: ganó una mano firme.',
    holes: {
      rana: 'La rana',
      molino: 'El molino',
      puente: 'El puente',
      tortuga: 'La tortuga',
      hoyo: 'Los hoyos'
    },
    aim: {
      title: '¡Elija el hoyo y lance!',
      text: 'Toque un hoyo de la mesa o elíjalo en la lista. Cuanto más difícil, más puntos; la probabilidad sube con la racha y la mano firme. El hoyo «¡Doble!» vale el doble este turno.',
      group: 'Hoyo al que lanza',
      points: (n: number) => `${n} puntos`,
      chance: (n: number) => `${pct(n)} % de entrar`,
      hot: '¡Doble!',
      steady: 'Mano firme',
      steadyHint: 'Sube un 20 % la probabilidad de que la moneda entre.',
      steadyOn: 'Mano firme activada.',
      last: (text: string) => `Última moneda: ${text}`
    },
    result: {
      rana: '¡La rana se la tragó!',
      hit: '¡Dentro!',
      miss: 'Rebotó y se fue',
      hitHint: (hole: string, chance: number) =>
        `Entró en ${hole.toLowerCase()}, con un ${pct(chance)} % de probabilidad.`,
      hotHint: '¡Era el hoyo doble: puntos por dos!',
      missHint: (hole: string, chance: number) =>
        `Solo tenía un ${pct(chance)} % de entrar en ${hole.toLowerCase()}. Pruebe un hoyo más fácil o use la mano firme.`,
      combo: (n: number) => `Monedas seguidas que entran: ${n}.`
    },
    live: {
      question: (n: number) => `Pregunta ${n}.`,
      ok: (points: number) => `Correcta. Gana ${points} puntos y una moneda.`,
      okSteady: 'Ganó una mano firme.',
      ko: 'Incorrecta. La respuesta queda descartada.',
      aim: (hot: string) => `Elija el hoyo y lance la moneda. El hoyo doble de este turno es ${hot}.`,
      picked: (hole: string, points: number, chance: number) =>
        `${hole}: ${points} puntos, ${pct(chance)} % de entrar.`,
      throwing: 'Lanzando.',
      hit: (hole: string, points: number) => `¡Dentro en ${hole.toLowerCase()}! Gana ${points} puntos.`,
      miss: (hole: string) => `La moneda rebotó: no entró en ${hole.toLowerCase()}.`,
      mode: (on: boolean) => (on ? 'Mano firme activada.' : 'Mano firme desactivada.')
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      title: '¡Se acabó la kermés!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      scored: 'Monedas dentro',
      ranas: 'En la rana',
      hots: 'Hoyos dobles',
      bestCombo: 'Mejor racha de monedas',
      accuracy: 'Puntería',
      again: 'Jugar de nuevo'
    },
    init: {
      title: 'La rana del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Está en una kermés frente a la mesa de rana: cada pregunta que acierte le da una moneda para lanzar.',
        'Si falla, esa respuesta se descarta y puede intentarlo de nuevo. Sin acierto no hay moneda.',
        'Con la moneda, toque un hoyo de la mesa o elíjalo en la lista: la rana da 50 puntos, el molino 30, el puente 25, la tortuga 20 y los hoyos 10.',
        'Cuanto más difícil el hoyo, menos probabilidad de que la moneda entre. Usted decide cuánto arriesgar: las probabilidades se ven antes de lanzar.',
        'En cada turno un hoyo está marcado «¡Doble!»: si entra, da el doble de puntos.',
        'La racha sube la probabilidad, y cada tres aciertos seguidos gana una mano firme (un 20 % más de probabilidad).',
        'La partida termina al acertar todas las preguntas y lanzar la última moneda.'
      ],
      back: 'Volver',
      start: '¡A lanzar!'
    },
    boom: '¡CLANC!'
  },
  en: {
    stage: (throws: number, hot: string) =>
      `Frog table seen from the front, with the frog on top and the mill, the bridge, the turtle and the holes below. Double hole this turn: ${hot}. Coins thrown: ${throws}.`,
    question: 'Question',
    of: 'of',
    check: 'Check',
    load: 'Take the coin',
    retry: 'Try again',
    fire: 'Throw!',
    nextQuestion: 'Next question',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', steady: 'Hand', scored: 'In' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    okHint: 'You won a coin! Take it and choose a hole.',
    koHint: 'That answer is ruled out. No correct answer, no coin: try again.',
    okSteady: 'Streak of three: you won a steady hand.',
    holes: {
      rana: 'The frog',
      molino: 'The mill',
      puente: 'The bridge',
      tortuga: 'The turtle',
      hoyo: 'The holes'
    },
    aim: {
      title: 'Pick a hole and throw!',
      text: 'Tap a hole on the table or choose it from the list. The harder it is, the more points; the chance goes up with your streak and a steady hand. The "Double!" hole is worth twice this turn.',
      group: 'Hole to throw at',
      points: (n: number) => `${n} points`,
      chance: (n: number) => `${pct(n)} % to go in`,
      hot: 'Double!',
      steady: 'Steady hand',
      steadyHint: 'Adds 20 % to the chance that the coin goes in.',
      steadyOn: 'Steady hand on.',
      last: (text: string) => `Last coin: ${text}`
    },
    result: {
      rana: 'The frog swallowed it!',
      hit: 'In!',
      miss: 'It bounced away',
      hitHint: (hole: string, chance: number) => `It went into ${hole.toLowerCase()}, with a ${pct(chance)} % chance.`,
      hotHint: 'It was the double hole: points times two!',
      missHint: (hole: string, chance: number) =>
        `It only had a ${pct(chance)} % chance of going into ${hole.toLowerCase()}. Try an easier hole or use the steady hand.`,
      combo: (n: number) => `Coins in a row: ${n}.`
    },
    live: {
      question: (n: number) => `Question ${n}.`,
      ok: (points: number) => `Correct. You win ${points} points and a coin.`,
      okSteady: 'You won a steady hand.',
      ko: 'Wrong. That answer is ruled out.',
      aim: (hot: string) => `Pick a hole and throw the coin. This turn's double hole is ${hot}.`,
      picked: (hole: string, points: number, chance: number) => `${hole}: ${points} points, ${pct(chance)} % to go in.`,
      throwing: 'Throwing.',
      hit: (hole: string, points: number) => `In ${hole.toLowerCase()}! You win ${points} points.`,
      miss: (hole: string) => `The coin bounced: it did not go into ${hole.toLowerCase()}.`,
      mode: (on: boolean) => (on ? 'Steady hand on.' : 'Steady hand off.')
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      title: 'Fair is over!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      scored: 'Coins in',
      ranas: 'In the frog',
      hots: 'Double holes',
      bestCombo: 'Best coin streak',
      accuracy: 'Accuracy',
      again: 'Play again'
    },
    init: {
      title: 'The frog of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'You are at a fair in front of the frog table: every question you get right gives you a coin to throw.',
        'If you miss, that answer is ruled out and you can try again. No correct answer, no coin.',
        'With the coin, tap a hole on the table or choose it from the list: the frog is worth 50 points, the mill 30, the bridge 25, the turtle 20 and the holes 10.',
        'The harder the hole, the lower the chance that the coin goes in. You decide how much to risk: the odds are shown before you throw.',
        'Every turn one hole is marked "Double!": if the coin goes in, it is worth twice the points.',
        'A streak raises the chance, and every three correct answers in a row you win a steady hand (20 % more chance).',
        'The game ends when you answer every question correctly and throw the last coin.'
      ],
      back: 'Back',
      start: "Let's throw!"
    },
    boom: 'CLANG!'
  }
};
