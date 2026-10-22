import type { SlotsSymbol, Tier } from '../types/types';

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    title: 'SUERTE 777',
    machine: {
      idle: 'Tragamonedas con tres carretes, todavía sin girar',
      spinning: 'Los carretes están girando',
      result: (names: string[]) => `Línea central: ${names.join(', ')}`
    },
    symbols: { cherry: 'cereza', bell: 'campana', star: 'estrella', seven: 'siete', diamond: 'diamante' } as Record<
      SlotsSymbol,
      string
    >,
    paytable: {
      label: 'Tabla de premios',
      row: (name: string, triple: number, pair: number) =>
        `${name}: tres iguales ${triple} puntos, dos iguales ${pair} puntos`
    },
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    retry: 'Reintentar',
    toPull: 'A la palanca',
    nextPull: 'Otra tirada',
    nextQuestion: 'Siguiente pregunta',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', pulls: 'Tiradas', solved: 'Aciertos' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    koHint: 'Esa respuesta queda descartada. Elige otra y vuelve a intentarlo.',
    okHint: 'Ganaste una tirada: tira de la palanca y mira qué sale.',
    okHintGold: '¡A la primera! Ganaste una palanca dorada: su premio vale el doble.',
    pull: {
      title: '¡Tira de la palanca!',
      gold: 'Palanca dorada: premio x2',
      normal: 'Tirada normal',
      left: (n: number) => `Tiradas por hacer: ${n}`,
      hint: 'Pulsa el botón o la palanca de la máquina. Los carretes se detienen uno a uno: busca símbolos iguales en la línea central.',
      pull: '¡Tirar!',
      spinning: 'Girando…'
    },
    result: {
      jackpot: (points: number) => `¡JACKPOT! ¡Ganas ${points} puntos!`,
      triple: (points: number) => `¡Tres iguales! Ganas ${points} puntos`,
      pair: (points: number) => `¡Pareja! Ganas ${points} puntos`,
      none: 'Esta vez no hay premio',
      jackpotText: 'Tres diamantes: el mayor premio y una tirada extra de regalo.',
      noneText: 'Los tres símbolos son distintos. ¡La próxima tirada puede ser la buena!',
      gold: 'Palanca dorada x2',
      extra: 'Tirada extra'
    },
    live: {
      ok: 'Correcta. Ganaste una tirada.',
      okGold: 'Correcta a la primera. Ganaste una palanca dorada.',
      okExtra: 'Racha de tres: ganaste una tirada extra.',
      ko: 'Incorrecta. La respuesta queda descartada.',
      spinning: 'Los carretes están girando.',
      landed: (names: string[], text: string) => `Los carretes se detuvieron: ${names.join(', ')}. ${text}`,
      won: (points: number) => `Ganas ${points} puntos.`,
      jackpot: (points: number) => `¡Jackpot! Ganas ${points} puntos y una tirada extra.`,
      none: 'Sin premio.'
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      title: '¡Tragamonedas completado!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      pulls: 'Tiradas',
      bestWin: 'Mejor premio',
      jackpots: 'Jackpots',
      again: 'Jugar de nuevo'
    },
    init: {
      title: 'Tragamonedas del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Responde la pregunta y pulsa «Comprobar»: solo las respuestas correctas ganan una tirada.',
        'Tira de la palanca: los tres carretes giran y se detienen uno a uno.',
        'Dos símbolos iguales en la línea central dan un premio pequeño; tres iguales, uno grande.',
        'Tres diamantes son el JACKPOT: el mayor premio y una tirada extra.',
        'Si aciertas a la primera, la palanca es dorada y su premio vale el doble.',
        'Cada tres aciertos seguidos ganas otra tirada.',
        'Si fallas, esa respuesta se descarta y puedes intentarlo de nuevo. Ganas cuando todas las preguntas estén acertadas.'
      ],
      back: 'Volver',
      start: '¡A jugar!'
    }
  },
  en: {
    title: 'LUCKY 777',
    machine: {
      idle: 'Slot machine with three reels, not spun yet',
      spinning: 'The reels are spinning',
      result: (names: string[]) => `Middle line: ${names.join(', ')}`
    },
    symbols: { cherry: 'cherry', bell: 'bell', star: 'star', seven: 'seven', diamond: 'diamond' } as Record<
      SlotsSymbol,
      string
    >,
    paytable: {
      label: 'Prize table',
      row: (name: string, triple: number, pair: number) =>
        `${name}: three of a kind ${triple} points, two of a kind ${pair} points`
    },
    question: 'Question',
    of: 'of',
    check: 'Check',
    retry: 'Try again',
    toPull: 'To the lever',
    nextPull: 'Another pull',
    nextQuestion: 'Next question',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', pulls: 'Pulls', solved: 'Correct' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    koHint: 'That answer is ruled out. Pick another one and try again.',
    okHint: 'You won a pull: pull the lever and see what comes up.',
    okHintGold: 'First try! You won a golden lever: its prize is worth double.',
    pull: {
      title: 'Pull the lever!',
      gold: 'Golden lever: prize x2',
      normal: 'Regular pull',
      left: (n: number) => `Pulls left: ${n}`,
      hint: 'Press the button or the lever on the machine. The reels stop one by one: look for matching symbols on the middle line.',
      pull: 'Pull!',
      spinning: 'Spinning…'
    },
    result: {
      jackpot: (points: number) => `JACKPOT! You win ${points} points!`,
      triple: (points: number) => `Three of a kind! You win ${points} points`,
      pair: (points: number) => `A pair! You win ${points} points`,
      none: 'No prize this time',
      jackpotText: 'Three diamonds: the biggest prize and a free extra pull.',
      noneText: 'All three symbols are different. The next pull could be the one!',
      gold: 'Golden lever x2',
      extra: 'Extra pull'
    },
    live: {
      ok: 'Correct. You won a pull.',
      okGold: 'Correct on the first try. You won a golden lever.',
      okExtra: 'Streak of three: you won an extra pull.',
      ko: 'Wrong. That answer is ruled out.',
      spinning: 'The reels are spinning.',
      landed: (names: string[], text: string) => `The reels stopped: ${names.join(', ')}. ${text}`,
      won: (points: number) => `You win ${points} points.`,
      jackpot: (points: number) => `Jackpot! You win ${points} points and an extra pull.`,
      none: 'No prize.'
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      title: 'Slot machine complete!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      pulls: 'Pulls',
      bestWin: 'Best prize',
      jackpots: 'Jackpots',
      again: 'Play again'
    },
    init: {
      title: 'The slot machine of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'Answer the question and press “Check”: only correct answers win a pull.',
        'Pull the lever: the three reels spin and stop one by one.',
        'Two matching symbols on the middle line give a small prize; three of a kind, a big one.',
        'Three diamonds are the JACKPOT: the biggest prize and an extra pull.',
        'If you get it right on the first try, the lever is golden and its prize is worth double.',
        'Every three correct answers in a row win another pull.',
        'If you miss, that answer is ruled out and you can try again. You win when every question is answered correctly.'
      ],
      back: 'Back',
      start: "Let's play!"
    }
  }
};

export const SYMBOLS: readonly SlotsSymbol[] = ['cherry', 'bell', 'star', 'seven', 'diamond'];

/** Cuánto pesa cada símbolo al salir en una pareja o un trío (las cerezas salen más y los diamantes casi nunca). */
export const SYMBOL_WEIGHTS: readonly number[] = [34, 26, 20, 14, 6];

/** Premio por dos y por tres símbolos iguales. */
export const PAY: Record<SlotsSymbol, { pair: number; triple: number }> = {
  cherry: { pair: 5, triple: 20 },
  bell: { pair: 10, triple: 50 },
  star: { pair: 25, triple: 100 },
  seven: { pair: 50, triple: 200 },
  diamond: { pair: 100, triple: 500 }
};

/**
 * Cómo suele salir una tirada. En un cuestionario hay pocas tiradas, así que la máquina es generosa:
 * casi siempre sale algo (el último valor de cada lista es el más raro).
 */
export const TIER_ORDER: readonly Tier[] = ['none', 'pair', 'triple'];
export const TIER_WEIGHTS: readonly number[] = [18, 42, 40];

/** Cada cuántos aciertos seguidos se gana una tirada extra. */
export const STREAK_PULL = 3;

/** Multiplicador del premio de la palanca dorada. */
export const GOLD_MULTIPLIER = 2;

/** Carretes de la máquina. */
export const REELS = 3;

/** Lo que muestran los carretes antes de la primera tirada: tira de 4 símbolos, la visible son las posiciones 0 a 2. */
export const START_STRIPS: readonly (readonly SlotsSymbol[])[] = [
  ['star', 'cherry', 'bell', 'seven'],
  ['bell', 'seven', 'diamond', 'cherry'],
  ['cherry', 'bell', 'star', 'seven']
];

/** Los carretes de la pantalla de inicio: tres sietes en la línea central. */
export const INIT_STRIPS: readonly (readonly SlotsSymbol[])[] = [
  ['cherry', 'seven', 'bell', 'star'],
  ['bell', 'seven', 'star', 'cherry'],
  ['star', 'seven', 'cherry', 'bell']
];

/** Confeti de monedas al ganar. */
export const FX_COLORS = ['#ffd23f', '#ffb81c', '#fff3b0', '#ff7a90', '#ffffff'] as const;
