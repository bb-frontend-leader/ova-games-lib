/** Puntos del juego. */
export const SCORE = {
  /** Por acertar a la primera y al reintentar tras un fallo. */
  answer: 10,
  retry: 5,
  /** Extra por racha: cada acierto seguido suma `streakStep` hasta `streakCap` veces. */
  streakStep: 2,
  streakCap: 4,
  /** Por cada fila o columna completada y por llenar la tabla. */
  line: 15,
  loteria: 50
} as const;

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    board: 'Su tabla de lotería',
    question: 'Carta',
    of: 'de',
    callerSays: 'El cantor dice…',
    next: 'Siguiente carta',
    retry: 'Probar otra carta',
    results: 'Ver resultados',
    pick: 'Toque en su tabla la carta que responde a la pista.',
    hintOn: 'Pista: solo quedan dos cartas posibles.',
    marked: 'marcada',
    discarded: 'descartada',
    hud: { score: 'Puntos', streak: 'Racha', lines: 'Líneas', beans: 'Frijoles' },
    verdict: { ok: '¡Frijol puesto!', ko: '¡Esa no era!' },
    okHint: 'La carta queda marcada con un frijol.',
    okLine: (n: number) =>
      `${n === 1 ? '¡Línea completa!' : `¡${n} líneas completas!`} Bono de ${n * SCORE.line} puntos.`,
    okLast: '¡Última carta! La tabla queda llena: ¡Lotería!',
    koHint: 'Esa carta queda descartada para esta pista. Pruebe con otra.',
    koClue: 'Dos fallos seguidos: el cantor deja solo dos cartas posibles.',
    shout: { line: '¡Buena!', loteria: '¡LOTERÍA!' },
    legend: {
      label: 'Cómo se juega',
      card: 'Cada carta es una respuesta',
      ok: 'Acierto: frijol en la carta',
      ko: 'Fallo: carta descartada',
      line: 'Fila o columna llena: bono'
    },
    live: {
      question: (n: number, total: number) => `Carta ${n} de ${total}.`,
      ok: (label: string, points: number) => `Correcto. La carta ${label} queda marcada. Gana ${points} puntos.`,
      line: (n: number) => (n === 1 ? 'Completó una línea.' : `Completó ${n} líneas.`),
      last: 'Era la última carta: la tabla está llena. ¡Lotería!',
      ko: (label: string) => `Incorrecto. La carta ${label} queda descartada.`,
      hint: 'Solo quedan dos cartas posibles.'
    },
    summary: {
      title: ['¡Lotería de oro!', '¡Lotería!', '¡Tabla llena!', '¡Lotería, con paciencia!'],
      text: [
        'Casi todas las cartas a la primera: el cantor no pudo sorprenderle.',
        'Llenó la tabla con muy buen ojo para las pistas.',
        'Llenó la tabla: algunas cartas le costaron, pero las encontró.',
        'Llenó la tabla a base de insistir. ¡Vale la pena jugar otra vez!'
      ],
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Cartas tocadas',
      errors: 'Descartadas',
      lines: 'Líneas',
      hints: 'Pistas',
      again: 'Jugar otra vez'
    },
    init: {
      title: 'Lotería',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'El cantor lee una pista y la respuesta es una de las cartas de su tabla.',
        'Toque la carta que responde a la pista: si acierta, le pone un frijol; si falla, la carta queda descartada y prueba con otra.',
        'Con dos fallos seguidos en una misma pista, el cantor deja solo dos cartas posibles.',
        'Cada fila o columna que complete da un bono de puntos: ¡Buena!',
        'Tres aciertos seguidos o más suman puntos de racha.',
        'Cuando la tabla esté llena, ¡grite Lotería!'
      ],
      back: 'Volver',
      start: '¡A jugar!'
    }
  },
  en: {
    board: 'Your lottery board',
    question: 'Card',
    of: 'of',
    callerSays: 'The caller says…',
    next: 'Next card',
    retry: 'Try another card',
    results: 'See results',
    pick: 'Tap the card on your board that answers the clue.',
    hintOn: 'Clue: only two cards are possible now.',
    marked: 'marked',
    discarded: 'ruled out',
    hud: { score: 'Score', streak: 'Streak', lines: 'Lines', beans: 'Beans' },
    verdict: { ok: 'Bean placed!', ko: 'Not that one!' },
    okHint: 'The card is marked with a bean.',
    okLine: (n: number) => `${n === 1 ? 'Line complete!' : `${n} lines complete!`} Bonus of ${n * SCORE.line} points.`,
    okLast: 'Last card! The board is full: Lotería!',
    koHint: 'That card is ruled out for this clue. Try another one.',
    koClue: 'Two misses in a row: the caller leaves only two possible cards.',
    shout: { line: 'Nice!', loteria: 'LOTERÍA!' },
    legend: {
      label: 'How to play',
      card: 'Each card is an answer',
      ok: 'Correct: bean on the card',
      ko: 'Wrong: card ruled out',
      line: 'Full row or column: bonus'
    },
    live: {
      question: (n: number, total: number) => `Card ${n} of ${total}.`,
      ok: (label: string, points: number) => `Correct. The card ${label} is marked. You win ${points} points.`,
      line: (n: number) => (n === 1 ? 'You completed a line.' : `You completed ${n} lines.`),
      last: 'That was the last card: the board is full. Lotería!',
      ko: (label: string) => `Wrong. The card ${label} is ruled out.`,
      hint: 'Only two cards are possible now.'
    },
    summary: {
      title: ['Golden Lotería!', 'Lotería!', 'Board full!', 'Lotería, with patience!'],
      text: [
        'Almost every card on the first try: the caller could not surprise you.',
        'You filled the board with a great eye for the clues.',
        'You filled the board: some cards were hard, but you found them.',
        'You filled the board by sticking with it. Worth playing again!'
      ],
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Cards tapped',
      errors: 'Ruled out',
      lines: 'Lines',
      hints: 'Clues',
      again: 'Play again'
    },
    init: {
      title: 'Lotería',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'The caller reads a clue and the answer is one of the cards on your board.',
        'Tap the card that answers the clue: if you are right, it gets a bean; if not, the card is ruled out and you try another.',
        'After two misses in a row on the same clue, the caller leaves only two possible cards.',
        'Every row or column you complete gives a bonus: Nice!',
        'Three or more correct cards in a row add streak points.',
        'When the board is full, shout Lotería!'
      ],
      back: 'Back',
      start: "Let's play!"
    }
  }
};

/** Fallos seguidos en una misma pista tras los que el cantor deja solo dos cartas posibles. */
export const HINT_AFTER = 2;

/** Duración (ms) de la marca de la carta: el resultado se entrega al terminarla. */
export const MARK_MS = { ok: 1500, line: 2000, ko: 1100 } as const;

/** Color de cada carta de la tabla (borde y número), en ciclo. Todos dan contraste suficiente con texto blanco. */
export const ACCENTS = ['#b3202c', '#b45f06', '#1f7a6e', '#6c2d91', '#1f5fb3', '#8a6d00'] as const;

/** Confeti del frijol y de la línea; humo del fallo. */
export const FX_COLORS = ['#ffd24a', '#ffffff', '#7fe3a5', '#ff7a59', '#9fd8ff'] as const;
export const LINE_COLORS = ['#ffd24a', '#ff5a8a', '#7fe3a5', '#ffffff', '#9fd8ff'] as const;
export const LOTERIA_COLORS = ['#ffd24a', '#ff5a8a', '#2ec4b6', '#ffffff', '#ff7a59', '#8e5bd6'] as const;
export const MISS_COLORS = ['#c9ced6', '#ff8a80', '#ffffff'] as const;
