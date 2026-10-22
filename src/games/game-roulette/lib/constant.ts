// Textos del juego en varios idiomas
export const i18n = {
  es: {
    spin: 'Girar',
    spinLabel: 'Girar la ruleta',
    spinning: 'Girando…',
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    next: 'Seguir girando',
    results: 'Ver resultados',
    joker: 'Comodín 50:50',
    jokerShort: 'Comodín',
    double: 'Doble',
    wheelLabel: 'Ruleta de preguntas',
    hud: { score: 'Puntos', streak: 'Racha', jokers: 'Comodines', solved: 'Aciertos', double: 'x2 en la próxima' },
    idle: { title: 'Tu turno', text: 'Pulsa «Girar» y la ruleta elegirá tu próxima pregunta.' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    koHint: 'Esa casilla volverá a la ruleta: tendrás otra oportunidad.',
    breakdown: { base: 'Base', streak: 'Racha', double: 'Doble', joker: 'Con comodín' },
    track: { label: 'Progreso de la ruleta', solved: 'acertada', review: 'por repasar', pending: 'pendiente' },
    live: {
      spinning: 'La ruleta está girando.',
      landed: (n: number, category?: string) =>
        `La ruleta se detuvo en la pregunta ${n}${category ? `, ${category}` : ''}.`,
      joker: (n: number) =>
        `¡Comodín 50:50! Ahora tienes ${n}. Úsalo en una pregunta para eliminar respuestas incorrectas.`,
      double: '¡Doble! Los puntos de tu próxima pregunta valen el doble.',
      jokerUsed: 'Comodín usado: quedan solo dos respuestas.',
      ok: (points: number, streak: number) =>
        `¡Correcta! Ganas ${points} puntos.${streak > 1 ? ` Racha de ${streak}.` : ''}`,
      ko: 'Incorrecta. Esa casilla volverá a la ruleta.'
    },
    summary: {
      title: '¡Ruleta completada!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      again: 'Jugar de nuevo'
    },
    init: {
      title: 'La ruleta del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Pulsa «Girar»: la ruleta elige al azar tu próxima pregunta.',
        'Responde y pulsa «Comprobar». Cada acierto suma puntos y las rachas suman más.',
        'Si fallas, esa casilla vuelve a la ruleta y la respuesta que elegiste queda descartada.',
        'Las casillas especiales dan un Comodín 50:50 (elimina respuestas incorrectas) o un Doble (tu próxima pregunta vale x2).',
        'Ganas cuando todas las preguntas estén acertadas.'
      ],
      back: 'Volver',
      start: '¡A girar!'
    }
  },
  en: {
    spin: 'Spin',
    spinLabel: 'Spin the wheel',
    spinning: 'Spinning…',
    question: 'Question',
    of: 'of',
    check: 'Check',
    next: 'Keep spinning',
    results: 'See results',
    joker: '50:50 lifeline',
    jokerShort: 'Lifeline',
    double: 'Double',
    wheelLabel: 'Question roulette',
    hud: { score: 'Score', streak: 'Streak', jokers: 'Lifelines', solved: 'Correct', double: 'x2 on the next one' },
    idle: { title: 'Your turn', text: 'Press “Spin” and the wheel will pick your next question.' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    koHint: 'That slice goes back on the wheel: you will get another chance.',
    breakdown: { base: 'Base', streak: 'Streak', double: 'Double', joker: 'With lifeline' },
    track: { label: 'Roulette progress', solved: 'correct', review: 'to review', pending: 'pending' },
    live: {
      spinning: 'The wheel is spinning.',
      landed: (n: number, category?: string) => `The wheel stopped on question ${n}${category ? `, ${category}` : ''}.`,
      joker: (n: number) => `50:50 lifeline! You now have ${n}. Use it on a question to remove wrong answers.`,
      double: 'Double! Your next question is worth twice the points.',
      jokerUsed: 'Lifeline used: only two answers are left.',
      ok: (points: number, streak: number) =>
        `Correct! You earn ${points} points.${streak > 1 ? ` Streak of ${streak}.` : ''}`,
      ko: 'Wrong. That slice goes back on the wheel.'
    },
    summary: {
      title: 'Roulette complete!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      again: 'Play again'
    },
    init: {
      title: 'The wheel of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'Press “Spin”: the wheel picks your next question at random.',
        'Answer and press “Check”. Every correct answer scores points and streaks score more.',
        'If you miss, that slice goes back on the wheel and the answer you chose is ruled out.',
        'Special slices give a 50:50 lifeline (removes wrong answers) or a Double (your next question is worth x2).',
        'You win when every question is answered correctly.'
      ],
      back: 'Back',
      start: "Let's spin!"
    }
  }
};

/** Colores de las casillas, con el color de texto que cumple contraste AA sobre ellas. */
export const PALETTE = [
  { bg: '#c62828', ink: '#ffffff' },
  { bg: '#1565c0', ink: '#ffffff' },
  { bg: '#2e7d32', ink: '#ffffff' },
  { bg: '#6a1b9a', ink: '#ffffff' },
  { bg: '#f9a825', ink: '#1b1b1b' },
  { bg: '#00838f', ink: '#ffffff' },
  { bg: '#ad1457', ink: '#ffffff' },
  { bg: '#bf360c', ink: '#ffffff' }
] as const;

export const SPECIAL_COLORS = {
  joker: { bg: '#004d40', ink: '#ffd54f' },
  double: { bg: '#311b92', ink: '#ffd54f' }
} as const;

/** Puntos: base por acierto (baja con cada fallo previo), bonus por racha y tope del bonus. */
export const SCORE = { base: 100, failPenalty: 30, minBase: 40, streakStep: 25, streakCap: 4 } as const;

/** Confeti del acierto. */
export const FX_COLORS = ['#ffd23f', '#ff7a90', '#5cc8ff', '#7be07b', '#ffffff'] as const;

export const DEFAULT_SPECIALS = ['joker', 'double'] as const;
