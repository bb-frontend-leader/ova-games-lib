import type { Cell } from '../types/types';

const near = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    boardLabel: 'Campo de minas',
    cell: {
      position: (row: number, col: number) => `Fila ${row}, columna ${col}`,
      closed: 'sin abrir',
      review: 'sin abrir, pregunta por repasar',
      flagged: 'con bandera',
      radar: 'mina marcada por el radar',
      open: (n: number) => (n ? `abierta, ${near(n, 'mina', 'minas')} alrededor` : 'abierta, ninguna mina alrededor'),
      boom: 'mina explotada',
      mine: 'mina'
    },
    minesLeft: (n: number) => `Minas: ${n}`,
    flagMode: 'Bandera',
    flagModeHint: 'Modo bandera: pulsa una casilla para marcarla',
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    retry: 'Reintentar',
    backToBoard: 'Volver al campo',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', shields: 'Escudos', solved: 'Aciertos' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    koHint: 'Esa respuesta queda descartada. La casilla sigue cerrada: vuelve a ella para intentarlo otra vez.',
    okHint: (n: number) =>
      n
        ? `Casilla despejada: ${near(n, 'mina', 'minas')} a su alrededor.`
        : 'Casilla despejada: ninguna mina alrededor.',
    okShield: '¡A la primera! Ganaste un escudo.',
    okRadar: 'Racha de tres: el radar marcó una mina.',
    guide: {
      title: '¡Despeja el campo!',
      text: 'Elige una casilla. Si es segura, responde su pregunta y verás cuántas minas hay a su alrededor. Si es una mina, explota.',
      number: 'El número indica cuántas minas hay en las casillas vecinas.',
      flag: 'Marca con bandera las casillas que creas minadas: así no las abrirás sin querer.',
      shield: 'Acertar a la primera da un escudo que absorbe una mina.',
      radar: 'Cada tres aciertos seguidos, el radar marca una mina por ti.',
      boom: (points: number) => `¡Boom! Era una mina. Pierdes ${points} puntos.`,
      boomNone: '¡Boom! Era una mina, pero no tenías puntos que perder.',
      shielded: '¡Boom! Era una mina, pero tu escudo la absorbió.'
    },
    live: {
      opened: (row: number, col: number) => `Casilla fila ${row}, columna ${col}: responde su pregunta.`,
      flagOn: 'Bandera puesta.',
      flagOff: 'Bandera quitada.',
      flaggedBlock: 'Esa casilla tiene bandera: quítala para abrirla.',
      radarBlock: 'Esa casilla la marcó el radar.',
      ok: (points: number) => `Correcta. Ganas ${points} puntos.`,
      okShield: 'Ganaste un escudo.',
      okRadar: 'El radar marcó una mina.',
      ko: 'Incorrecta. La respuesta queda descartada.',
      boom: (points: number) => `¡Boom! Era una mina. Pierdes ${points} puntos.`,
      boomNone: '¡Boom! Era una mina, pero no tenías puntos que perder.',
      shielded: '¡Boom! Era una mina, pero tu escudo la absorbió.',
      mode: (on: boolean) => (on ? 'Modo bandera activado.' : 'Modo bandera desactivado.')
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      title: '¡Campo despejado!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      minesHit: 'Minas pisadas',
      flagsOk: 'Minas marcadas',
      bonus: 'Bonus final',
      again: 'Jugar de nuevo'
    },
    init: {
      title: 'Buscaminas del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Cada casilla segura esconde una pregunta; hay también minas escondidas.',
        'Abre una casilla: si es segura, responde su pregunta. Si es una mina, explota y pierdes puntos.',
        'Al acertar, la casilla se despeja y su número dice cuántas minas hay alrededor. Úsalo para deducir dónde están.',
        'Con el modo bandera marcas las casillas que creas minadas, y así no las abres sin querer.',
        'Si aciertas a la primera, ganas un escudo que absorbe una mina. Cada tres aciertos seguidos, el radar marca una mina.',
        'Si fallas, esa respuesta se descarta y la casilla sigue cerrada: puedes volver a intentarlo.',
        'Ganas cuando todas las casillas seguras estén despejadas. Al final suman las minas marcadas y los escudos que te queden.'
      ],
      back: 'Volver',
      start: '¡A jugar!'
    }
  },
  en: {
    boardLabel: 'Minefield',
    cell: {
      position: (row: number, col: number) => `Row ${row}, column ${col}`,
      closed: 'closed',
      review: 'closed, question to review',
      flagged: 'flagged',
      radar: 'mine marked by the radar',
      open: (n: number) => (n ? `open, ${near(n, 'mine', 'mines')} nearby` : 'open, no mines nearby'),
      boom: 'exploded mine',
      mine: 'mine'
    },
    minesLeft: (n: number) => `Mines: ${n}`,
    flagMode: 'Flag',
    flagModeHint: 'Flag mode: tap a cell to mark it',
    question: 'Question',
    of: 'of',
    check: 'Check',
    retry: 'Try again',
    backToBoard: 'Back to the field',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', shields: 'Shields', solved: 'Correct' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    koHint: 'That answer is ruled out. The cell stays closed: come back to it to try again.',
    okHint: (n: number) => (n ? `Cell cleared: ${near(n, 'mine', 'mines')} nearby.` : 'Cell cleared: no mines nearby.'),
    okShield: 'First try! You won a shield.',
    okRadar: 'Streak of three: the radar marked a mine.',
    guide: {
      title: 'Clear the field!',
      text: 'Pick a cell. If it is safe, answer its question and you will see how many mines are nearby. If it is a mine, it explodes.',
      number: 'The number tells how many mines are in the neighbouring cells.',
      flag: 'Flag the cells you think are mined, so you do not open them by mistake.',
      shield: 'Getting it right on the first try gives a shield that absorbs one mine.',
      radar: 'Every three correct answers in a row, the radar marks a mine for you.',
      boom: (points: number) => `Boom! It was a mine. You lose ${points} points.`,
      boomNone: 'Boom! It was a mine, but you had no points to lose.',
      shielded: 'Boom! It was a mine, but your shield absorbed it.'
    },
    live: {
      opened: (row: number, col: number) => `Cell row ${row}, column ${col}: answer its question.`,
      flagOn: 'Flag placed.',
      flagOff: 'Flag removed.',
      flaggedBlock: 'That cell has a flag: remove it to open it.',
      radarBlock: 'The radar marked that cell.',
      ok: (points: number) => `Correct. You win ${points} points.`,
      okShield: 'You won a shield.',
      okRadar: 'The radar marked a mine.',
      ko: 'Wrong. That answer is ruled out.',
      boom: (points: number) => `Boom! It was a mine. You lose ${points} points.`,
      boomNone: 'Boom! It was a mine, but you had no points to lose.',
      shielded: 'Boom! It was a mine, but your shield absorbed it.',
      mode: (on: boolean) => (on ? 'Flag mode on.' : 'Flag mode off.')
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      title: 'Field cleared!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      minesHit: 'Mines hit',
      flagsOk: 'Mines flagged',
      bonus: 'Final bonus',
      again: 'Play again'
    },
    init: {
      title: 'The minesweeper of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'Every safe cell hides a question; there are hidden mines too.',
        'Open a cell: if it is safe, answer its question. If it is a mine, it explodes and you lose points.',
        'When you get it right, the cell is cleared and its number tells how many mines are nearby. Use it to work out where they are.',
        'Flag mode marks the cells you think are mined, so you do not open them by mistake.',
        'If you get it right on the first try you win a shield that absorbs one mine. Every three correct answers in a row, the radar marks a mine.',
        'If you miss, that answer is ruled out and the cell stays closed: you can try again.',
        'You win when every safe cell is cleared. At the end, flagged mines and leftover shields add bonus points.'
      ],
      back: 'Back',
      start: "Let's play!"
    }
  }
};

/** Puntos del juego. */
export const SCORE = {
  /** Por despejar una casilla a la primera y al reintentar. */
  cell: 10,
  retry: 5,
  /** Extra por racha: cada acierto seguido suma `streakStep` hasta `streakCap` veces. */
  streakStep: 2,
  streakCap: 4,
  /** Lo que se pierde al pisar una mina sin escudo. */
  mine: 20,
  /** Al terminar: por cada mina marcada y por cada escudo que sobra. */
  flag: 5,
  shield: 10
} as const;

/** Escudos que se pueden tener a la vez. */
export const MAX_SHIELDS = 3;

/** Cada cuántos aciertos seguidos el radar marca una mina. */
export const STREAK_RADAR = 3;

/** Columnas del campo por defecto. */
export const DEFAULT_COLUMNS = 4;

/** Casillas de la pantalla de inicio: un campo pequeño ya jugado a medias. */
export const INIT_COLUMNS = 4;
export const INIT_CELLS: Pick<Cell, 'mine' | 'adj' | 'status' | 'flag' | 'radar'>[] = [
  { mine: false, adj: 1, status: 'open', flag: false, radar: false },
  { mine: false, adj: 0, status: 'open', flag: false, radar: false },
  { mine: false, adj: 0, status: 'open', flag: false, radar: false },
  { mine: false, adj: 1, status: 'open', flag: false, radar: false },
  { mine: true, adj: 0, status: 'closed', flag: true, radar: false },
  { mine: false, adj: 2, status: 'open', flag: false, radar: false },
  { mine: false, adj: 1, status: 'open', flag: false, radar: false },
  { mine: false, adj: 2, status: 'closed', flag: false, radar: false },
  { mine: false, adj: 1, status: 'closed', flag: false, radar: false },
  { mine: true, adj: 0, status: 'boom', flag: false, radar: false },
  { mine: false, adj: 3, status: 'open', flag: false, radar: false },
  { mine: true, adj: 0, status: 'closed', flag: true, radar: true }
];

/** Confeti de la explosión y del acierto. */
export const FX_COLORS = ['#ffc933', '#ff8a3d', '#ffffff', '#7fe3c8', '#ff6b6b'] as const;
export const BOOM_COLORS = ['#ff6b6b', '#ff8a3d', '#ffc933', '#ffffff', '#3b3b3b'] as const;
