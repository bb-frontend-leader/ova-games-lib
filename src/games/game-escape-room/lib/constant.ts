import type { ObjectIcon } from './icons';

import type { Obj } from '../types/types';

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    rooms: ['La biblioteca', 'El laboratorio', 'La cámara acorazada'],
    objects: {
      book: 'Libro',
      clock: 'Reloj',
      chest: 'Cofre',
      frame: 'Cuadro',
      flask: 'Matraz',
      lamp: 'Lámpara',
      globe: 'Globo terráqueo',
      drawer: 'Cajón',
      key: 'Llavero'
    },
    sceneLabel: (n: number, total: number, name: string) => `Sala ${n} de ${total}: ${name}`,
    roomCounter: (n: number, total: number) => `Sala ${n}/${total}`,
    openCounter: (open: number, total: number) => `Objetos ${open}/${total}`,
    obj: {
      position: (name: string) => name,
      locked: 'cerrado con candado',
      review: 'cerrado, pregunta por repasar',
      open: (slot: number, digit: number) => `abierto: dígito ${digit} para la posición ${slot}`
    },
    door: {
      label: 'Puerta',
      locked: 'cerrada',
      open: 'abierta',
      slot: (position: number, digit: number | null) =>
        digit === null ? `posición ${position}: vacía` : `posición ${position}: ${digit}`
    },
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    hint: (n: number) => `Pista (${n})`,
    backToRoom: 'Volver a la sala',
    toDoor: 'Ir a la puerta',
    nextRoom: 'Siguiente sala',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', hints: 'Pistas', solved: 'Aciertos' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    koHint: 'Esa respuesta queda descartada. El objeto sigue cerrado: vuelve a él para intentarlo otra vez.',
    okHint: (name: string, slot: number, digit: number) =>
      `Abriste ${name}: dentro hay un papel con el dígito ${digit} para la posición ${slot} del código.`,
    okHintGain: 'Racha de tres: ganaste una pista.',
    okCleared: 'La sala está despejada: ve a la puerta y escribe el código.',
    guide: {
      text: 'Elige un objeto de la sala, responde su pregunta y abre su candado. Cada objeto guarda un dígito del código de la puerta.',
      notes: 'Libreta',
      slot: (slot: number) => `Posición ${slot}`,
      unknown: 'sin descubrir'
    },
    keypad: {
      title: 'La puerta',
      text: 'Escribe el código con los dígitos de la libreta, siguiendo el orden de las posiciones.',
      label: 'Teclado numérico',
      digit: (n: number) => `Dígito ${n}`,
      erase: 'Borrar',
      open: 'Abrir',
      typed: (entry: number[]) => (entry.length ? `Código escrito: ${entry.join(' ')}` : 'Código vacío')
    },
    result: {
      title: '¡Puerta abierta!',
      text: 'El código era correcto. La puerta se abre.',
      points: (n: number) => `+${n} puntos`
    },
    live: {
      room: (n: number, name: string) => `Sala ${n}: ${name}. Elige un objeto.`,
      opened: (name: string) => `${name}: responde su pregunta.`,
      ok: (points: number) => `Correcta. Ganas ${points} puntos.`,
      okHintGain: 'Ganaste una pista.',
      okCleared: 'Sala despejada: ve a la puerta.',
      ko: 'Incorrecta. La respuesta queda descartada.',
      hint: 'Pista usada: se descartaron respuestas incorrectas.',
      hintNone: 'No quedan pistas.',
      door: 'Escribe el código en la puerta.',
      digit: (n: number, count: number, total: number) => `Dígito ${n}. Llevas ${count} de ${total}.`,
      erased: 'Dígito borrado.',
      wrong: (points: number) =>
        points ? `Código incorrecto. Pierdes ${points} puntos.` : 'Código incorrecto. Mira bien la libreta.',
      right: (points: number) => `Código correcto. La puerta se abre. Ganas ${points} puntos.`
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      title: '¡Lo lograste: escapaste!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      rooms: 'Salas superadas',
      hintsUsed: 'Pistas usadas',
      badCodes: 'Códigos fallidos',
      bonus: 'Bonus de pistas',
      again: 'Jugar de nuevo'
    },
    init: {
      title: 'Escape room del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Estás encerrado en una sala. Para salir hay que abrir la puerta con un código.',
        'Cada objeto de la sala tiene un candado: responde su pregunta para abrirlo.',
        'Dentro de cada objeto hay un papel con un dígito y la posición que ocupa en el código. Se guarda en tu libreta.',
        'Cuando abras todos los objetos, ve a la puerta y escribe el código siguiendo el orden de las posiciones.',
        'Si te atascas, usa una pista: descarta respuestas incorrectas. Cada tres aciertos seguidos ganas otra.',
        'Un código equivocado te cuesta puntos. Si fallas una pregunta, esa respuesta se descarta y puedes intentarlo de nuevo.',
        'Escapas cuando abres la puerta de la última sala. Las pistas que te sobren suman al final.'
      ],
      back: 'Volver',
      start: '¡A jugar!'
    }
  },
  en: {
    rooms: ['The library', 'The laboratory', 'The vault'],
    objects: {
      book: 'Book',
      clock: 'Clock',
      chest: 'Chest',
      frame: 'Painting',
      flask: 'Flask',
      lamp: 'Lamp',
      globe: 'Globe',
      drawer: 'Drawer',
      key: 'Key ring'
    },
    sceneLabel: (n: number, total: number, name: string) => `Room ${n} of ${total}: ${name}`,
    roomCounter: (n: number, total: number) => `Room ${n}/${total}`,
    openCounter: (open: number, total: number) => `Objects ${open}/${total}`,
    obj: {
      position: (name: string) => name,
      locked: 'padlocked',
      review: 'locked, question to review',
      open: (slot: number, digit: number) => `open: digit ${digit} for position ${slot}`
    },
    door: {
      label: 'Door',
      locked: 'locked',
      open: 'open',
      slot: (position: number, digit: number | null) =>
        digit === null ? `position ${position}: empty` : `position ${position}: ${digit}`
    },
    question: 'Question',
    of: 'of',
    check: 'Check',
    hint: (n: number) => `Hint (${n})`,
    backToRoom: 'Back to the room',
    toDoor: 'Go to the door',
    nextRoom: 'Next room',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', hints: 'Hints', solved: 'Correct' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    koHint: 'That answer is ruled out. The object stays locked: come back to it to try again.',
    okHint: (name: string, slot: number, digit: number) =>
      `You opened the ${name.toLowerCase()}: inside there is a paper with the digit ${digit} for position ${slot} of the code.`,
    okHintGain: 'Streak of three: you won a hint.',
    okCleared: 'The room is cleared: go to the door and type the code.',
    guide: {
      text: 'Pick an object in the room, answer its question and open its padlock. Every object holds a digit of the door code.',
      notes: 'Notebook',
      slot: (slot: number) => `Position ${slot}`,
      unknown: 'not found yet'
    },
    keypad: {
      title: 'The door',
      text: 'Type the code with the digits in your notebook, following the order of the positions.',
      label: 'Number pad',
      digit: (n: number) => `Digit ${n}`,
      erase: 'Erase',
      open: 'Open',
      typed: (entry: number[]) => (entry.length ? `Typed code: ${entry.join(' ')}` : 'Empty code')
    },
    result: {
      title: 'Door open!',
      text: 'The code was right. The door opens.',
      points: (n: number) => `+${n} points`
    },
    live: {
      room: (n: number, name: string) => `Room ${n}: ${name}. Pick an object.`,
      opened: (name: string) => `${name}: answer its question.`,
      ok: (points: number) => `Correct. You win ${points} points.`,
      okHintGain: 'You won a hint.',
      okCleared: 'Room cleared: go to the door.',
      ko: 'Wrong. That answer is ruled out.',
      hint: 'Hint used: wrong answers were ruled out.',
      hintNone: 'No hints left.',
      door: 'Type the code on the door.',
      digit: (n: number, count: number, total: number) => `Digit ${n}. You have ${count} of ${total}.`,
      erased: 'Digit erased.',
      wrong: (points: number) =>
        points ? `Wrong code. You lose ${points} points.` : 'Wrong code. Check your notebook carefully.',
      right: (points: number) => `Right code. The door opens. You win ${points} points.`
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      title: 'You did it: you escaped!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      rooms: 'Rooms cleared',
      hintsUsed: 'Hints used',
      badCodes: 'Wrong codes',
      bonus: 'Hint bonus',
      again: 'Play again'
    },
    init: {
      title: 'The escape room of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'You are locked in a room. To get out you must open the door with a code.',
        'Every object in the room has a padlock: answer its question to open it.',
        'Inside each object there is a paper with a digit and its position in the code. It goes into your notebook.',
        'When every object is open, go to the door and type the code following the order of the positions.',
        'If you are stuck, use a hint: it rules out wrong answers. Every three correct answers in a row you win another.',
        'A wrong code costs you points. If you miss a question, that answer is ruled out and you can try again.',
        'You escape when you open the door of the last room. Leftover hints add points at the end.'
      ],
      back: 'Back',
      start: "Let's play!"
    }
  }
};

/** Puntos del juego. */
export const SCORE = {
  /** Por acertar a la primera y al reintentar (o usando la pista). */
  answer: 10,
  retry: 5,
  /** Extra por racha: cada acierto seguido suma `streakStep` hasta `streakCap` veces. */
  streakStep: 2,
  streakCap: 4,
  /** Por abrir una puerta y lo que se pierde por un código equivocado (sin bajar de cero). */
  room: 20,
  badCode: 5,
  /** Al terminar: por cada pista que sobra. */
  hint: 5
} as const;

/** Pistas con las que se empieza, las que se pueden tener a la vez y cada cuántos aciertos seguidos se gana una. */
export const START_HINTS = 2;
export const MAX_HINTS = 3;
export const STREAK_HINT = 3;

/** Objetos (y dígitos del código) por sala. */
export const DEFAULT_PER_ROOM = 4;

/** Objetos de cada sala, en orden; las salas siguen el orden de `i18n.rooms` y se repiten si hay más. */
export const ROOM_ICONS: ObjectIcon[][] = [
  ['book', 'clock', 'chest', 'frame'],
  ['flask', 'lamp', 'globe', 'drawer'],
  ['drawer', 'key', 'clock', 'chest']
];

/** Sala de la pantalla de inicio: ya medio resuelta, con la puerta cerrada y el código a medias. */
export const INIT_OBJECTS: Obj[] = [
  { id: 0, q: 0, room: 0, slot: 2, digit: 7, icon: 'book', open: true },
  { id: 1, q: 1, room: 0, slot: 4, digit: 3, icon: 'clock', open: false },
  { id: 2, q: 2, room: 0, slot: 1, digit: 5, icon: 'chest', open: true },
  { id: 3, q: 3, room: 0, slot: 3, digit: 9, icon: 'frame', open: false }
];
export const INIT_ENTRY = [5, 7];

/** Confeti del acierto y de la puerta. */
export const FX_COLORS = ['#ffc933', '#ff8a3d', '#ffffff', '#7fe3c8', '#ff6b6b'] as const;
export const OPEN_COLORS = ['#fff3b0', '#ffc933', '#7fe3c8', '#ffffff'] as const;
