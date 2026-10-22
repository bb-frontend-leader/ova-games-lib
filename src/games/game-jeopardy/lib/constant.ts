// Textos del juego en varios idiomas
export const i18n = {
  es: {
    boardLabel: 'Tablero de preguntas',
    points: 'puntos',
    solved: 'acertada',
    review: 'por repasar',
    question: 'Pregunta',
    check: 'Comprobar',
    back: 'Volver al tablero',
    results: 'Ver resultados',
    joker: 'Comodín 50:50',
    hud: { score: 'Puntos', streak: 'Racha', lifelines: 'Comodines', solved: 'Aciertos' },
    hint: 'Elige una casilla: cuantos más puntos, más difícil la pregunta.',
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    koHint: 'La casilla sigue en el tablero, con la respuesta descartada y a mitad de puntos.',
    koHintDouble: 'Pierdes lo apostado. La casilla sigue en el tablero, con la respuesta descartada.',
    breakdown: { base: 'Base', streak: 'Racha', joker: 'Con comodín', retry: 'Repesca', wager: 'Apuesta' },
    wager: {
      title: '¡Apuesta doble!',
      text: 'Esta casilla era la escondida. Elige cuánto arriesgar antes de ver la pregunta: si aciertas ganas lo apostado y si fallas lo pierdes.',
      options: ['Apuesta baja', 'Apuesta media', 'Apuesta alta']
    },
    live: {
      opened: (category: string, points: number) => `Casilla abierta: ${category}, ${points} puntos.`,
      wager: '¡Apuesta doble! Elige cuánto quieres apostar.',
      jokerUsed: 'Comodín usado: quedan solo dos respuestas.',
      ok: (points: number, streak: number) =>
        `¡Correcta! Ganas ${points} puntos.${streak > 1 ? ` Racha de ${streak}.` : ''}`,
      ko: 'Incorrecta.',
      koLost: (points: number) => `Incorrecta. Pierdes ${points} puntos.`
    },
    track: { label: 'Progreso del tablero' },
    summary: {
      title: '¡Tablero completado!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      again: 'Jugar de nuevo'
    },
    init: {
      title: 'El tablero del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Elige una casilla del tablero: cuantos más puntos vale, más difícil es la pregunta.',
        'Responde y pulsa «Comprobar». Cada acierto suma puntos y las rachas dan un extra.',
        'Si fallas, la casilla sigue en el tablero con la respuesta descartada y vale la mitad.',
        'Hay una casilla escondida de «Apuesta doble»: eliges cuánto arriesgar antes de ver la pregunta.',
        'Los comodines 50:50 eliminan respuestas incorrectas, pero la pregunta vale la mitad.',
        'Ganas cuando todas las casillas estén acertadas.'
      ],
      back: 'Volver',
      start: '¡Al tablero!'
    }
  },
  en: {
    boardLabel: 'Question board',
    points: 'points',
    solved: 'correct',
    review: 'to review',
    question: 'Question',
    check: 'Check',
    back: 'Back to the board',
    results: 'See results',
    joker: '50:50 lifeline',
    hud: { score: 'Score', streak: 'Streak', lifelines: 'Lifelines', solved: 'Correct' },
    hint: 'Pick a tile: the more points, the harder the question.',
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    koHint: 'The tile stays on the board, with that answer ruled out and worth half.',
    koHintDouble: 'You lose what you wagered. The tile stays on the board, with that answer ruled out.',
    breakdown: { base: 'Base', streak: 'Streak', joker: 'With lifeline', retry: 'Retry', wager: 'Wager' },
    wager: {
      title: 'Daily double!',
      text: 'This was the hidden tile. Choose how much to risk before seeing the question: if you are right you win the wager, if not you lose it.',
      options: ['Low wager', 'Medium wager', 'High wager']
    },
    live: {
      opened: (category: string, points: number) => `Tile opened: ${category}, ${points} points.`,
      wager: 'Daily double! Choose how much you want to wager.',
      jokerUsed: 'Lifeline used: only two answers are left.',
      ok: (points: number, streak: number) =>
        `Correct! You earn ${points} points.${streak > 1 ? ` Streak of ${streak}.` : ''}`,
      ko: 'Wrong.',
      koLost: (points: number) => `Wrong. You lose ${points} points.`
    },
    track: { label: 'Board progress' },
    summary: {
      title: 'Board complete!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      again: 'Play again'
    },
    init: {
      title: 'The board of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'Pick a tile: the more points it is worth, the harder the question.',
        'Answer and press “Check”. Every correct answer scores points and streaks give a bonus.',
        'If you miss, the tile stays on the board with that answer ruled out and is worth half.',
        'One hidden tile is a “Daily double”: you choose how much to risk before seeing the question.',
        'The 50:50 lifelines remove wrong answers, but the question is worth half.',
        'You win when every tile is answered correctly.'
      ],
      back: 'Back',
      start: 'To the board!'
    }
  }
};

/** Puntos: la repesca y el comodín valen la mitad; el bonus de racha es una fracción de la casilla (con tope). */
export const SCORE = { retry: 0.5, joker: 0.5, streakStep: 0.1, streakCap: 4, defaultStep: 100 } as const;

/** Multiplicadores de la apuesta doble. */
export const WAGERS = [1, 2, 3] as const;

/** Confeti del acierto. */
export const FX_COLORS = ['#ffd23f', '#ff7a90', '#5cc8ff', '#7be07b', '#ffffff'] as const;

export const DEFAULT_LIFELINES = 2;
export const DEFAULT_DOUBLES = 1;
