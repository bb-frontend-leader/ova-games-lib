import type { Block } from '../types/types';

const cells = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Posición apuntada en palabras: "centrado", "2 casillas a la derecha"… */
const place = (n: number, side: [string, string], centered: string, one: string, many: string) =>
  n === 0 ? centered : `${cells(Math.abs(n), one, many)} ${n > 0 ? side[1] : side[0]}`;

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    stage: (height: number) => `Torre de ${cells(height, 'bloque', 'bloques')}`,
    height: (n: number) => `Altura: ${n}`,
    calmMode: 'Calma',
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    place: 'Colocar bloque',
    drop: 'Soltar bloque',
    retry: 'Reintentar',
    nextQuestion: 'Siguiente pregunta',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', calm: 'Calma', solved: 'Aciertos' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    koHint: 'Esa respuesta queda descartada. Sin respuesta correcta no hay bloque: inténtalo otra vez.',
    okHint: '¡Ganaste un bloque! La grúa lo trae: colócalo sobre la torre.',
    okCalm: 'Racha de tres: ganaste una carga de calma.',
    guide: {
      title: '¡A construir!',
      text: 'Mueve la grúa hasta dejar el bloque justo encima de la torre y suéltalo. Lo que sobresalga se corta.',
      aimLabel: 'Posición del bloque',
      aimValue: (n: number) => place(n, ['a la izquierda', 'a la derecha'], 'centrado', 'casilla', 'casillas'),
      wind: (n: number) =>
        n
          ? `Viento: empujará el bloque ${cells(Math.abs(n), 'casilla', 'casillas')} a la ${n > 0 ? 'derecha' : 'izquierda'} mientras cae. Apunta al otro lado para compensarlo.`
          : 'No hay viento: el bloque caerá justo donde lo sueltes.',
      calm: 'Calma activada: esta vez el viento no te empuja.',
      legend: {
        perfect: 'Encaja justo: bonus, y cada tres encajes seguidos la torre se ensancha.',
        partial: 'Sobresale: se corta lo que sobra y el bloque siguiente es más estrecho.',
        miss: 'Fuera de la torre: el bloque se cae y no suma altura.'
      }
    },
    result: {
      perfect: '¡Encaja justo!',
      partial: (cut: number) => `Bloque colocado. Se corta ${cells(cut, 'casilla', 'casillas')}.`,
      miss: 'El bloque cayó fuera de la torre.',
      combo: (n: number) => `Encajes seguidos: ${n}.`,
      grew: '¡Refuerzo! La torre se ensancha una casilla.',
      points: (n: number) => `+${n} puntos`
    },
    live: {
      question: (n: number) => `Pregunta ${n}.`,
      ok: (points: number) => `Correcta. Ganas ${points} puntos y un bloque.`,
      okCalm: 'Ganaste una carga de calma.',
      ko: 'Incorrecta. La respuesta queda descartada.',
      aim: (wind: string) => `Coloca el bloque. ${wind}`,
      aimed: (value: string) => `Posición: ${value}.`,
      dropping: 'Soltando el bloque.',
      perfect: (points: number) => `¡Encaja justo! Ganas ${points} puntos.`,
      partial: (cut: number, points: number) =>
        `Bloque colocado, se corta ${cells(cut, 'casilla', 'casillas')}. Ganas ${points} puntos.`,
      miss: 'El bloque cayó fuera de la torre.',
      grew: 'La torre se ensancha una casilla.',
      mode: (on: boolean) => (on ? 'Calma activada.' : 'Calma desactivada.')
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      title: '¡Torre terminada!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      height: 'Altura de la torre',
      perfects: 'Encajes justos',
      bestCombo: 'Mejor racha de encajes',
      fallen: 'Bloques caídos',
      again: 'Jugar de nuevo'
    },
    init: {
      title: 'Torre de bloques del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Vas a construir una torre, un bloque por cada pregunta que aciertes.',
        'Cuando aciertes, la grúa trae un bloque: elige su posición con el control y suéltalo sobre la torre.',
        'Lo que sobresalga se corta, y el siguiente bloque será más estrecho. Si cae del todo fuera, se pierde.',
        'Hay viento: empuja el bloque mientras cae. Apunta al lado contrario para que encaje justo.',
        'Cada encaje justo da bonus, y cada tres seguidos la torre se ensancha una casilla.',
        'Cada tres aciertos seguidos ganas una carga de calma: con ella el viento no te empuja.',
        'Si fallas, esa respuesta se descarta y puedes intentarlo de nuevo. La partida termina al acertar todas las preguntas.'
      ],
      back: 'Volver',
      start: '¡A jugar!'
    }
  },
  en: {
    stage: (height: number) => `Tower of ${cells(height, 'block', 'blocks')}`,
    height: (n: number) => `Height: ${n}`,
    calmMode: 'Calm',
    question: 'Question',
    of: 'of',
    check: 'Check',
    place: 'Place block',
    drop: 'Drop block',
    retry: 'Try again',
    nextQuestion: 'Next question',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', calm: 'Calm', solved: 'Correct' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    koHint: 'That answer is ruled out. No correct answer, no block: try again.',
    okHint: 'You won a block! The crane brings it: place it on the tower.',
    okCalm: 'Streak of three: you won a calm charge.',
    guide: {
      title: "Let's build!",
      text: 'Move the crane until the block is right above the tower, then drop it. Whatever sticks out is cut off.',
      aimLabel: 'Block position',
      aimValue: (n: number) => place(n, ['to the left', 'to the right'], 'centered', 'cell', 'cells'),
      wind: (n: number) =>
        n
          ? `Wind: it will push the block ${cells(Math.abs(n), 'cell', 'cells')} to the ${n > 0 ? 'right' : 'left'} as it falls. Aim the other way to make up for it.`
          : 'No wind: the block will land right where you drop it.',
      calm: 'Calm on: the wind will not push you this time.',
      legend: {
        perfect: 'A perfect fit: bonus, and every three in a row the tower widens.',
        partial: 'It sticks out: the extra is cut off and the next block is narrower.',
        miss: 'Off the tower: the block falls and adds no height.'
      }
    },
    result: {
      perfect: 'A perfect fit!',
      partial: (cut: number) => `Block placed. ${cells(cut, 'cell', 'cells')} cut off.`,
      miss: 'The block fell off the tower.',
      combo: (n: number) => `Perfect fits in a row: ${n}.`,
      grew: 'Reinforcement! The tower widens by one cell.',
      points: (n: number) => `+${n} points`
    },
    live: {
      question: (n: number) => `Question ${n}.`,
      ok: (points: number) => `Correct. You win ${points} points and a block.`,
      okCalm: 'You won a calm charge.',
      ko: 'Wrong. That answer is ruled out.',
      aim: (wind: string) => `Place the block. ${wind}`,
      aimed: (value: string) => `Position: ${value}.`,
      dropping: 'Dropping the block.',
      perfect: (points: number) => `A perfect fit! You win ${points} points.`,
      partial: (cut: number, points: number) =>
        `Block placed, ${cells(cut, 'cell', 'cells')} cut off. You win ${points} points.`,
      miss: 'The block fell off the tower.',
      grew: 'The tower widens by one cell.',
      mode: (on: boolean) => (on ? 'Calm on.' : 'Calm off.')
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      title: 'Tower complete!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      height: 'Tower height',
      perfects: 'Perfect fits',
      bestCombo: 'Best fit streak',
      fallen: 'Fallen blocks',
      again: 'Play again'
    },
    init: {
      title: 'The block tower of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'You will build a tower, one block for every question you get right.',
        'When you get one right, the crane brings a block: choose its position with the control and drop it on the tower.',
        'Whatever sticks out is cut off, and the next block is narrower. If it falls completely off, it is lost.',
        'There is wind: it pushes the block as it falls. Aim the opposite way so it fits perfectly.',
        'Every perfect fit gives a bonus, and every three in a row the tower widens by one cell.',
        'Every three correct answers in a row you win a calm charge: with it the wind does not push you.',
        'If you miss, that answer is ruled out and you can try again. The game ends when you answer every question correctly.'
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
  /** Por encajar justo (más `combo` por cada encaje seguido, hasta `comboCap`) y por casilla de un bloque que sobresale. */
  perfect: 20,
  combo: 5,
  comboCap: 5,
  block: 3
} as const;

/** Cargas de calma que se pueden tener a la vez y cada cuántos aciertos seguidos se gana una. */
export const MAX_CALM = 2;
export const STREAK_CALM = 3;

/** Cada cuántos encajes justos seguidos la torre se ensancha una casilla. */
export const GROW_EVERY = 3;

/** Alcance de la grúa a cada lado (casillas) y vientos posibles (los más suaves salen más). */
export const AIM_RANGE = 4;
export const WINDS = [-2, -1, -1, 0, 1, 1, 2] as const;

/** Torre de la pantalla de inicio. */
export const INIT_ROWS = 7;
export const INIT_BLOCKS: Block[] = [
  { id: 0, level: 0, left: 5, width: 5, perfect: false },
  { id: 1, level: 1, left: 5, width: 5, perfect: true },
  { id: 2, level: 2, left: 6, width: 4, perfect: false },
  { id: 3, level: 3, left: 6, width: 4, perfect: true }
];

/** Confeti del acierto, polvo del impacto y chispas del encaje justo. */
export const FX_COLORS = ['#ffc933', '#ff8a3d', '#ffffff', '#7fe3c8', '#ff6b6b'] as const;
export const DUST_COLORS = ['#e8d3a8', '#cfb37f', '#ffffff', '#b89a64'] as const;
export const SPARK_COLORS = ['#fff3b0', '#ffc933', '#ffffff', '#ffe066'] as const;
