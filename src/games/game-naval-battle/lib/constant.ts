import type { Cell } from '../types/types';

const near = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const SHIPS_ES: Record<number, string> = {
  1: 'la lancha',
  2: 'el patrullero',
  3: 'el crucero',
  4: 'el acorazado',
  5: 'el portaaviones'
};
const SHIPS_EN: Record<number, string> = { 1: 'dinghy', 2: 'patrol boat', 3: 'cruiser', 4: 'battleship', 5: 'carrier' };

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    boardLabel: 'Mar enemigo',
    cell: {
      position: (row: number, col: number) => `Fila ${row}, columna ${col}`,
      water: 'sin disparar',
      miss: 'agua',
      hit: 'barco tocado',
      sunk: 'barco hundido',
      ping: (n: number) => `sin disparar, el sonar detecta ${near(n, 'casilla', 'casillas')} de barco alrededor`
    },
    fleetLeft: (n: number) => `Barcos: ${n}`,
    sonarMode: 'Sonar',
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    aim: 'Apuntar',
    retry: 'Reintentar',
    again: 'Disparar otra vez',
    nextQuestion: 'Siguiente pregunta',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', sonar: 'Sonar', solved: 'Aciertos' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    koHint: 'Esa respuesta queda descartada. Sin munición no hay disparo: inténtalo otra vez.',
    okHint: '¡Ganaste un disparo! Apunta al mar enemigo.',
    okSonar: 'Racha de tres: ganaste una carga de sonar.',
    guide: {
      title: '¡Fuego!',
      text: 'Elige una casilla del mar enemigo y dispara. Si das en un barco, ¡disparas otra vez!',
      pingTitle: 'Sonar listo',
      pingText:
        'Pulsa una casilla: el sonar cuenta cuántas casillas de barco sin tocar hay en ella y las 8 de alrededor. No gasta el disparo.',
      legend: {
        miss: 'Agua: no había barco.',
        hit: 'Tocado: hay un barco. ¡Sigue disparando!',
        sunk: 'Hundido: todas sus casillas están tocadas.',
        ping: 'El número es el aviso del sonar.'
      },
      pinged: (n: number) =>
        n
          ? `El sonar detecta ${near(n, 'casilla', 'casillas')} de barco por ahí.`
          : 'El sonar no detecta ningún barco por ahí.'
    },
    shot: {
      miss: 'Agua. No había nada ahí.',
      hit: '¡Tocado!',
      sunk: (size: number) => `¡Hundido! Cae ${SHIPS_ES[size] ?? `el barco de ${size}`}.`,
      fleet: '¡Flota enemiga destruida! Llega una flota nueva.',
      again: 'Tocar da otro disparo.',
      points: (n: number) => `+${n} puntos`
    },
    live: {
      question: (n: number) => `Pregunta ${n}.`,
      ok: (points: number) => `Correcta. Ganas ${points} puntos y un disparo.`,
      okSonar: 'Ganaste una carga de sonar.',
      ko: 'Incorrecta. La respuesta queda descartada.',
      aim: 'Elige una casilla y dispara.',
      firing: (row: number, col: number) => `Disparo a fila ${row}, columna ${col}.`,
      miss: 'Agua.',
      hit: '¡Tocado! Disparas otra vez.',
      hitLast: '¡Tocado!',
      sunk: (size: number, points: number) =>
        `¡Barco hundido: ${SHIPS_ES[size] ?? `el barco de ${size}`}! Ganas ${points} puntos.`,
      fleet: 'Flota enemiga destruida. Llega una flota nueva.',
      mode: (on: boolean) => (on ? 'Sonar activado.' : 'Sonar desactivado.'),
      pinged: (n: number) =>
        n ? `Sonar: ${near(n, 'casilla', 'casillas')} de barco alrededor.` : 'Sonar: ningún barco alrededor.',
      pingTaken: 'Esa casilla ya tiene un aviso del sonar.',
      shotTaken: 'Ya disparaste a esa casilla.'
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      title: '¡Misión cumplida!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      shots: 'Disparos',
      hits: 'Tocados',
      shipsSunk: 'Barcos hundidos',
      fleetsSunk: 'Flotas destruidas',
      again: 'Jugar de nuevo'
    },
    init: {
      title: 'Batalla naval del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Una flota enemiga se esconde en el mar. Tu misión es hundirla.',
        'Cada pregunta que aciertes te da un disparo. Elige una casilla del mar y dispara.',
        'Si das en un barco, ¡tocado! y disparas otra vez. Si es agua, pasa la siguiente pregunta.',
        'Un barco se hunde cuando tocas todas sus casillas. Al hundir la flota entera llega una nueva.',
        'Cada tres aciertos seguidos ganas una carga de sonar: pulsa una casilla y te dice cuántos barcos hay cerca, sin gastar el disparo.',
        'Si fallas, esa respuesta se descarta y puedes intentarlo de nuevo.',
        'La partida termina cuando aciertas todas las preguntas.'
      ],
      back: 'Volver',
      start: '¡A jugar!'
    }
  },
  en: {
    boardLabel: 'Enemy sea',
    cell: {
      position: (row: number, col: number) => `Row ${row}, column ${col}`,
      water: 'not fired at',
      miss: 'water',
      hit: 'ship hit',
      sunk: 'ship sunk',
      ping: (n: number) => `not fired at, the sonar detects ${near(n, 'ship cell', 'ship cells')} nearby`
    },
    fleetLeft: (n: number) => `Ships: ${n}`,
    sonarMode: 'Sonar',
    question: 'Question',
    of: 'of',
    check: 'Check',
    aim: 'Aim',
    retry: 'Try again',
    again: 'Fire again',
    nextQuestion: 'Next question',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', sonar: 'Sonar', solved: 'Correct' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    koHint: 'That answer is ruled out. No ammo, no shot: try again.',
    okHint: 'You won a shot! Aim at the enemy sea.',
    okSonar: 'Streak of three: you won a sonar charge.',
    guide: {
      title: 'Fire!',
      text: 'Pick a cell of the enemy sea and fire. If you hit a ship, you fire again!',
      pingTitle: 'Sonar ready',
      pingText:
        'Tap a cell: the sonar counts how many unhit ship cells are in it and the 8 around it. It does not use your shot.',
      legend: {
        miss: 'Water: there was no ship.',
        hit: 'Hit: there is a ship. Keep firing!',
        sunk: 'Sunk: every cell of it is hit.',
        ping: 'The number is the sonar reading.'
      },
      pinged: (n: number) =>
        n ? `The sonar detects ${near(n, 'ship cell', 'ship cells')} there.` : 'The sonar detects no ships there.'
    },
    shot: {
      miss: 'Water. Nothing there.',
      hit: 'Hit!',
      sunk: (size: number) => `Sunk! The ${SHIPS_EN[size] ?? `${size}-cell ship`} goes down.`,
      fleet: 'Enemy fleet destroyed! A new fleet arrives.',
      again: 'A hit gives you another shot.',
      points: (n: number) => `+${n} points`
    },
    live: {
      question: (n: number) => `Question ${n}.`,
      ok: (points: number) => `Correct. You win ${points} points and a shot.`,
      okSonar: 'You won a sonar charge.',
      ko: 'Wrong. That answer is ruled out.',
      aim: 'Pick a cell and fire.',
      firing: (row: number, col: number) => `Firing at row ${row}, column ${col}.`,
      miss: 'Water.',
      hit: 'Hit! You fire again.',
      hitLast: 'Hit!',
      sunk: (size: number, points: number) =>
        `The ${SHIPS_EN[size] ?? `${size}-cell ship`} is sunk! You win ${points} points.`,
      fleet: 'Enemy fleet destroyed. A new fleet arrives.',
      mode: (on: boolean) => (on ? 'Sonar on.' : 'Sonar off.'),
      pinged: (n: number) => (n ? `Sonar: ${near(n, 'ship cell', 'ship cells')} nearby.` : 'Sonar: no ships nearby.'),
      pingTaken: 'That cell already has a sonar reading.',
      shotTaken: 'You already fired at that cell.'
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      title: 'Mission complete!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      shots: 'Shots',
      hits: 'Hits',
      shipsSunk: 'Ships sunk',
      fleetsSunk: 'Fleets destroyed',
      again: 'Play again'
    },
    init: {
      title: 'The naval battle of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'An enemy fleet hides in the sea. Your mission is to sink it.',
        'Every question you get right gives you a shot. Pick a cell of the sea and fire.',
        'If you hit a ship, you fire again. If it is water, on to the next question.',
        'A ship sinks when every one of its cells is hit. When the whole fleet is sunk, a new one arrives.',
        'Every three correct answers in a row you win a sonar charge: tap a cell and it tells you how many ships are near, without using your shot.',
        'If you miss, that answer is ruled out and you can try again.',
        'The game ends when you have answered every question correctly.'
      ],
      back: 'Back',
      start: "Let's play!"
    }
  }
};

/** Puntos del juego. */
export const SCORE = {
  /** Por acertar a la primera y al reintentar. */
  answer: 10,
  retry: 5,
  /** Extra por racha: cada acierto seguido suma `streakStep` hasta `streakCap` veces. */
  streakStep: 2,
  streakCap: 4,
  /** Por disparo que toca, por barco hundido y por flota entera destruida. */
  hit: 10,
  sunk: 20,
  fleet: 30
} as const;

/** Cargas de sonar que se pueden tener a la vez. */
export const MAX_SONAR = 3;

/** Cada cuántos aciertos seguidos se gana una carga de sonar. */
export const STREAK_SONAR = 3;

/** Lado del mar (casillas) y barcos por defecto: un crucero y dos patrulleros. */
export const DEFAULT_SIZE = 6;
export const DEFAULT_FLEET = [3, 2, 2];

/** Mar de la pantalla de inicio: un campo pequeño con un barco hundido, un tocado y un fallo. */
export const INIT_SIZE = 4;
export const INIT_CELLS: Pick<Cell, 'ship' | 'status' | 'ping'>[] = [
  { ship: null, status: 'water', ping: null },
  { ship: null, status: 'miss', ping: null },
  { ship: null, status: 'water', ping: 1 },
  { ship: null, status: 'water', ping: null },
  { ship: 0, status: 'sunk', ping: null },
  { ship: 0, status: 'sunk', ping: null },
  { ship: null, status: 'water', ping: null },
  { ship: null, status: 'miss', ping: null },
  { ship: null, status: 'water', ping: null },
  { ship: null, status: 'water', ping: null },
  { ship: 1, status: 'hit', ping: null },
  { ship: 1, status: 'water', ping: null },
  { ship: null, status: 'miss', ping: null },
  { ship: null, status: 'water', ping: null },
  { ship: null, status: 'water', ping: null },
  { ship: null, status: 'water', ping: null }
];

/** Confeti del acierto y de las explosiones; agua para el chapoteo. */
export const FX_COLORS = ['#ffc933', '#ff8a3d', '#ffffff', '#7fe3c8', '#ff6b6b'] as const;
export const HIT_COLORS = ['#ff6b6b', '#ff8a3d', '#ffc933', '#ffffff', '#3b3b3b'] as const;
export const SPLASH_COLORS = ['#ffffff', '#bfe8ff', '#7cc4f2', '#4aa3df'] as const;
