import type { PlinkoPrize } from '../types/types';

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    boardLabel: 'Tablero de Plinko con los premios en el fondo',
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    retry: 'Reintentar',
    toDrop: 'Soltar ficha',
    nextBall: 'Soltar otra ficha',
    nextQuestion: 'Siguiente pregunta',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', balls: 'Fichas', solved: 'Aciertos' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    koHint: 'Esa respuesta queda descartada. Elige otra y vuelve a intentarlo.',
    okHint: 'Ganaste una ficha: apúntala y suéltala sobre el tablero.',
    okHintGold: '¡A la primera! Ganaste una ficha dorada: su premio vale el doble.',
    aim: {
      title: 'Apunta tu ficha',
      label: 'Dónde soltar la ficha',
      value: (n: number, total: number) => `Posición ${n} de ${total}`,
      hint: 'Mueve el control o pulsa sobre el tablero. Los clavos decidirán el resto: los premios mayores están en los bordes.',
      drop: '¡Soltar!',
      dropping: 'Cayendo…',
      gold: 'Ficha dorada: premio x2',
      normal: 'Ficha normal',
      left: (n: number) => `Fichas por soltar: ${n}`
    },
    landed: {
      prize: (points: number) => `¡Ganas ${points} puntos!`,
      bonus: '¡Ficha extra!',
      bonusText: 'Cayó en la casilla extra: tienes otra ficha por soltar.',
      gold: 'Ficha dorada x2',
      slot: 'Casilla'
    },
    bonus: 'EXTRA',
    live: {
      ok: 'Correcta. Ganaste una ficha.',
      okGold: 'Correcta a la primera. Ganaste una ficha dorada.',
      okExtra: 'Racha de tres: ganaste una ficha extra.',
      ko: 'Incorrecta. La respuesta queda descartada.',
      dropping: 'La ficha está cayendo.',
      landedPrize: (slot: number, points: number) => `La ficha cayó en la casilla ${slot}. Ganas ${points} puntos.`,
      landedBonus: (slot: number) => `La ficha cayó en la casilla extra, la ${slot}. Ganaste otra ficha.`
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      title: '¡Plinko completado!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      balls: 'Fichas',
      bestPrize: 'Mejor premio',
      again: 'Jugar de nuevo'
    },
    init: {
      title: 'Plinko del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Responde la pregunta y pulsa «Comprobar»: solo las respuestas correctas ganan una ficha.',
        'Apunta la ficha y suéltala: los clavos la harán rebotar hasta un premio.',
        'Los premios más grandes están en los bordes, donde es más difícil caer.',
        'Si aciertas a la primera, la ficha es dorada y su premio vale el doble.',
        'La casilla «Extra» te da otra ficha, y cada tres aciertos seguidos ganas una más.',
        'Si fallas, esa respuesta se descarta y puedes intentarlo de nuevo.',
        'Ganas cuando todas las preguntas estén acertadas.'
      ],
      back: 'Volver',
      start: '¡A jugar!'
    }
  },
  en: {
    boardLabel: 'Plinko board with the prizes at the bottom',
    question: 'Question',
    of: 'of',
    check: 'Check',
    retry: 'Try again',
    toDrop: 'Drop the chip',
    nextBall: 'Drop another chip',
    nextQuestion: 'Next question',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', balls: 'Chips', solved: 'Correct' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    koHint: 'That answer is ruled out. Pick another one and try again.',
    okHint: 'You won a chip: aim it and drop it on the board.',
    okHintGold: 'First try! You won a golden chip: its prize is worth double.',
    aim: {
      title: 'Aim your chip',
      label: 'Where to drop the chip',
      value: (n: number, total: number) => `Position ${n} of ${total}`,
      hint: 'Move the control or tap the board. The pegs decide the rest: the biggest prizes are at the edges.',
      drop: 'Drop!',
      dropping: 'Falling…',
      gold: 'Golden chip: prize x2',
      normal: 'Regular chip',
      left: (n: number) => `Chips left to drop: ${n}`
    },
    landed: {
      prize: (points: number) => `You win ${points} points!`,
      bonus: 'Extra chip!',
      bonusText: 'It landed on the extra slot: you have another chip to drop.',
      gold: 'Golden chip x2',
      slot: 'Slot'
    },
    bonus: 'EXTRA',
    live: {
      ok: 'Correct. You won a chip.',
      okGold: 'Correct on the first try. You won a golden chip.',
      okExtra: 'Streak of three: you won an extra chip.',
      ko: 'Wrong. That answer is ruled out.',
      dropping: 'The chip is falling.',
      landedPrize: (slot: number, points: number) => `The chip landed in slot ${slot}. You win ${points} points.`,
      landedBonus: (slot: number) => `The chip landed in the extra slot, number ${slot}. You won another chip.`
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      title: 'Plinko complete!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      balls: 'Chips',
      bestPrize: 'Best prize',
      again: 'Play again'
    },
    init: {
      title: 'The Plinko of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'Answer the question and press “Check”: only correct answers win a chip.',
        'Aim the chip and drop it: the pegs make it bounce down to a prize.',
        'The biggest prizes are at the edges, where it is harder to land.',
        'If you get it right on the first try, the chip is golden and its prize is worth double.',
        'The “Extra” slot gives you another chip, and every three correct answers in a row win one more.',
        'If you miss, that answer is ruled out and you can try again.',
        'You win when every question is answered correctly.'
      ],
      back: 'Back',
      start: "Let's play!"
    }
  }
};

/** Premios del fondo, de izquierda a derecha: los grandes en los bordes, donde cuesta más caer. */
export const DEFAULT_PRIZES: readonly PlinkoPrize[] = [500, 100, 50, 20, 'bonus', 20, 50, 100, 500];

/** Cada cuántos aciertos seguidos se gana una ficha extra. */
export const STREAK_BALL = 3;

/** Multiplicador del premio de la ficha dorada. */
export const GOLD_MULTIPLIER = 2;

/** Confeti de la ficha al caer. */
export const FX_COLORS = ['#ffd23f', '#ff7a90', '#5cc8ff', '#7be07b', '#ffffff'] as const;
