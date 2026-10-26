const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    board: (you: string, rival: string) =>
      `Tablero de parqués. Tus fichas amarillas: ${you}. Fichas rojas del rival: ${rival}.`,
    boardIdle: 'Tablero de parqués con fichas amarillas y rojas',
    place: { jail: 'en la cárcel', road: 'en juego', home: 'en el cielo' },
    youName: 'Tú',
    rivalName: 'Rival',
    piece: (n: number, place: string) => `Ficha ${n}: ${place}`,
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    retry: 'Reintentar',
    roll: 'Tirar los dados',
    goRoll: 'Ir a los dados',
    rolling: 'Tirando…',
    rollBonus: 'Tirar otra vez',
    follow: 'Seguir',
    advance: 'Seguir',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', home: 'En el cielo', captures: 'Capturas', solved: 'Preguntas' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    okHint: '¡Buen camino! Has ganado una tirada de dados.',
    okLast: '¡Era la última pregunta! Tira los dados por última vez.',
    okSkip: 'Todas tus fichas están en el cielo: no hay nada que mover.',
    koHint: 'Esa respuesta queda descartada: sin acierto no hay tirada. Inténtalo otra vez.',
    dieLabel: (a: number, b: number) => `Dados: ${a} y ${b}`,
    dieIdle: 'Dados sin tirar',
    wait: { title: 'Tu turno de dados', text: 'Responde bien la pregunta para ganar una tirada.' },
    rollTitle: '¡A tirar los dados!',
    rollText: 'Un 5 (o una suma de 5) abre la cárcel. Si sacas un par, tiras otra vez.',
    bonusTitle: '¡Par! Tirada extra',
    bonusText: 'Sacaste un par: tira otra vez sin responder ninguna pregunta.',
    stuckTitle: 'La cárcel sigue cerrada',
    stuckText: (tries: number) => `No salió un 5 ni una suma de 5. Llevas ${tries} de 3 intentos: vuelve a tirar.`,
    chooseTitle: 'Elige una ficha',
    chooseText: (sum: number) =>
      `Con ${sum} puedes mover una de estas fichas. También puedes pulsar la ficha en el tablero.`,
    option: {
      exit: 'sale de la cárcel',
      move: (n: number) => `avanza ${plural(n, 'casilla', 'casillas')}`,
      capture: 'y captura',
      home: 'llega al cielo'
    },
    rival: {
      idle: 'Espera su turno.',
      rolling: 'Tira los dados…',
      rolled: (a: number, b: number) => `Saca ${a} y ${b}.`,
      moving: 'Mueve una ficha…',
      exit: 'Saca una ficha de la cárcel.',
      move: (n: number) => `Avanza ${plural(n, 'casilla', 'casillas')}.`,
      capture: 'Te captura una ficha.',
      home: 'Mete una ficha en el cielo.',
      stuck: 'No logra salir de la cárcel.',
      allHome: 'Todas sus fichas están en el cielo.'
    },
    youHome: 'Todas tus fichas están en el cielo: te quedas sin tirar este turno.',
    stops: {
      capture: { title: '¡Captura!', text: 'Tu ficha cae sobre una del rival y la manda de vuelta a la cárcel.' },
      captured: { title: '¡Te capturaron!', text: 'El rival cayó sobre una de tus fichas: vuelve a la cárcel.' },
      home: { title: '¡Al cielo!', text: 'Una de tus fichas llegó al cielo. ¡Ya está a salvo!' },
      rivalHome: { title: 'El rival llegó al cielo', text: 'Una ficha roja entró al cielo.' },
      stuck: { title: 'Sin salida', text: 'Tres intentos sin un 5: pierdes la tirada. El turno pasa al rival.' }
    },
    legend: {
      label: 'Reglas del tablero',
      safe: 'Seguro: no te capturan',
      five: 'Un 5 o suma 5: sales',
      pair: 'Un par: tiras otra vez',
      capture: 'Caer sobre el rival: captura'
    },
    live: {
      question: (n: number) => `Pregunta ${n}.`,
      ok: (points: number) => `Correcta. Ganas ${points} puntos y una tirada de dados.`,
      okLast: (points: number) => `Correcta. Ganas ${points} puntos. Era la última pregunta.`,
      ko: 'Incorrecta. La respuesta queda descartada.',
      rolled: (a: number, b: number) => `Sacas ${a} y ${b}, suman ${a + b}.`,
      moving: 'Moviendo la ficha.',
      stop: (title: string, text: string) => `${title} ${text}`,
      roll: 'Tira los dados.',
      choose: 'Elige qué ficha mover.',
      rival: 'Turno del rival.'
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      win: '¡Ganaste la partida!',
      lose: 'El rival ganó la partida',
      winText: 'Tus fichas llegaron más lejos que las del rival.',
      loseText: 'Esta vez el rival llegó más lejos, pero has resuelto todas las preguntas.',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      rolls: 'Tiradas',
      home: 'Tus fichas en el cielo',
      rivalHome: 'Fichas del rival en el cielo',
      captures: 'Capturas',
      captured: 'Veces capturado',
      again: 'Jugar otra vez'
    },
    init: {
      title: 'Parqués',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Juegas con las fichas amarillas contra las rojas del rival. Cada pregunta que aciertas te da una tirada de dos dados.',
        'Si fallas, esa respuesta se descarta y tienes que intentarlo otra vez: sin acierto no hay tirada.',
        'Las fichas empiezan en la cárcel. Un 5 en un dado (o una suma de 5) las deja salir. Si no sale, tienes tres intentos.',
        'Con la suma de los dados avanzas una ficha por el circuito y, al dar la vuelta, por tu pasillo hasta el cielo.',
        'Si caes sobre una ficha rival fuera de un seguro, la capturas y vuelve a su cárcel. En los seguros (con estrella) nadie es capturado.',
        'Un par te da otra tirada sin pregunta. Después juega el rival. Al acabar las preguntas gana quien tenga sus fichas más cerca del cielo.'
      ],
      back: 'Volver',
      start: '¡A jugar!'
    }
  },
  en: {
    board: (you: string, rival: string) => `Ludo board. Your yellow pieces: ${you}. The rival's red pieces: ${rival}.`,
    boardIdle: 'Ludo board with yellow and red pieces',
    place: { jail: 'in jail', road: 'in play', home: 'in heaven' },
    youName: 'You',
    rivalName: 'Rival',
    piece: (n: number, place: string) => `Piece ${n}: ${place}`,
    question: 'Question',
    of: 'of',
    check: 'Check',
    retry: 'Try again',
    roll: 'Roll the dice',
    goRoll: 'Go to the dice',
    rolling: 'Rolling…',
    rollBonus: 'Roll again',
    follow: 'Continue',
    advance: 'Continue',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', home: 'In heaven', captures: 'Captures', solved: 'Questions' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    okHint: 'Good going! You have earned a dice roll.',
    okLast: 'That was the last question! Roll the dice one last time.',
    okSkip: 'All your pieces are in heaven: there is nothing left to move.',
    koHint: 'That answer is ruled out: no correct answer, no roll. Try again.',
    dieLabel: (a: number, b: number) => `Dice: ${a} and ${b}`,
    dieIdle: 'Dice not rolled',
    wait: { title: 'Your dice turn', text: 'Answer the question correctly to earn a roll.' },
    rollTitle: 'Roll the dice!',
    rollText: 'A 5 (or a sum of 5) opens the jail. If you roll a pair, you roll again.',
    bonusTitle: 'Pair! Extra roll',
    bonusText: 'You rolled a pair: roll again without answering any question.',
    stuckTitle: 'The jail is still closed',
    stuckText: (tries: number) => `No 5 and no sum of 5. You have used ${tries} of 3 tries: roll again.`,
    chooseTitle: 'Pick a piece',
    chooseText: (sum: number) =>
      `With ${sum} you can move one of these pieces. You can also press the piece on the board.`,
    option: {
      exit: 'leaves the jail',
      move: (n: number) => `moves ${plural(n, 'square', 'squares')}`,
      capture: 'and captures',
      home: 'reaches heaven'
    },
    rival: {
      idle: 'Waiting for its turn.',
      rolling: 'Rolling the dice…',
      rolled: (a: number, b: number) => `Rolls ${a} and ${b}.`,
      moving: 'Moving a piece…',
      exit: 'Takes a piece out of jail.',
      move: (n: number) => `Moves ${plural(n, 'square', 'squares')}.`,
      capture: 'Captures one of your pieces.',
      home: 'Puts a piece in heaven.',
      stuck: 'Cannot get out of jail.',
      allHome: 'All its pieces are in heaven.'
    },
    youHome: 'All your pieces are in heaven: you skip your roll this turn.',
    stops: {
      capture: { title: 'Capture!', text: "Your piece lands on a rival's piece and sends it back to jail." },
      captured: { title: 'You were captured!', text: 'The rival landed on one of your pieces: it goes back to jail.' },
      home: { title: 'To heaven!', text: 'One of your pieces reached heaven. It is safe now!' },
      rivalHome: { title: 'The rival reached heaven', text: 'A red piece entered heaven.' },
      stuck: { title: 'No way out', text: 'Three tries without a 5: you lose the roll. The turn passes to the rival.' }
    },
    legend: {
      label: 'Board rules',
      safe: 'Safe: no captures',
      five: 'A 5 or sum 5: you leave',
      pair: 'A pair: roll again',
      capture: "Land on the rival's piece: capture"
    },
    live: {
      question: (n: number) => `Question ${n}.`,
      ok: (points: number) => `Correct. You win ${points} points and a dice roll.`,
      okLast: (points: number) => `Correct. You win ${points} points. That was the last question.`,
      ko: 'Wrong. That answer is ruled out.',
      rolled: (a: number, b: number) => `You roll ${a} and ${b}, a total of ${a + b}.`,
      moving: 'Moving the piece.',
      stop: (title: string, text: string) => `${title} ${text}`,
      roll: 'Roll the dice.',
      choose: 'Pick which piece to move.',
      rival: "The rival's turn."
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      win: 'You won the game!',
      lose: 'The rival won the game',
      winText: "Your pieces got further than the rival's.",
      loseText: 'This time the rival got further, but you have answered every question.',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      rolls: 'Rolls',
      home: 'Your pieces in heaven',
      rivalHome: "Rival's pieces in heaven",
      captures: 'Captures',
      captured: 'Times captured',
      again: 'Play again'
    },
    init: {
      title: 'Ludo',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        "You play the yellow pieces against the rival's red ones. Every question you get right earns you a roll of two dice.",
        'If you get it wrong, that answer is ruled out and you must try again: no correct answer, no roll.',
        'Pieces start in jail. A 5 on a die (or a sum of 5) lets one out. If it does not come, you have three tries.',
        'The sum of the dice moves one piece round the circuit and, after the lap, up your lane to heaven.',
        'If you land on a rival piece outside a safe square, you capture it and it goes back to its jail. On safe squares (with a star) nobody is captured.',
        'A pair gives you another roll without a question. Then the rival plays. When the questions run out, whoever has pieces closer to heaven wins.'
      ],
      back: 'Back',
      start: "Let's play!"
    }
  }
};

export { plural };

/** Puntos del juego. */
export const SCORE = {
  /** Por acertar a la primera y al reintentar. */
  answer: 10,
  retry: 5,
  /** Extra por racha: cada acierto seguido suma `streakStep` hasta `streakCap` veces. */
  streakStep: 2,
  streakCap: 4,
  /** Por capturar una ficha rival y por meter una ficha en el cielo. */
  capture: 20,
  home: 30,
  /** Por ganar la partida. */
  win: 50
} as const;

/** Intentos de salir de la cárcel por turno cuando todas las fichas siguen dentro. */
export const MAX_TRIES = 3;

/** Pausa del rival antes de tirar y antes de mover, para que se vea lo que hace (en ms). */
export const RIVAL_PAUSE = 750;

/** Probabilidad de que el rival elija una jugada al azar en vez de la mejor. */
export const RIVAL_BLUNDER = 0.3;

/** Confeti del acierto y destellos del cielo. */
export const FX_COLORS = ['#ffd24a', '#ffffff', '#7fe3a5', '#ff7a59', '#9fd8ff'] as const;
export const HOME_COLORS = ['#fff3b0', '#ffc933', '#ffffff', '#7fe3a5', '#ff8a3d'] as const;
export const CAPTURE_COLORS = ['#ff5a4a', '#ffffff', '#ffc933'] as const;
