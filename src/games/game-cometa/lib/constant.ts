/** Puntos del juego. */
export const SCORE = {
  /** Por acertar a la primera y al reintentar. */
  answer: 10,
  retry: 5,
  /** Extra por racha: cada acierto seguido suma `streakStep` hasta `streakCap` veces. */
  streakStep: 2,
  streakCap: 4
} as const;

/** Carretes de reserva que se pueden tener a la vez y cada cuántos aciertos seguidos se gana uno. */
export const MAX_SPOOL = 2;
export const STREAK_SPOOL = 3;

/** Colores de los lazos de la cola (uno por acierto a la primera). */
export const BOW_COLORS = ['#ff4d6d', '#ffd23f', '#3a86ff', '#06d6a0', '#ff9f1c', '#b86bff'] as const;

/** Pantalla de inicio: cometa a media altura y con tres lazos. */
export const INIT_ALTITUDE = 0.5;
export const INIT_BOWS = 3;

/** Confeti del acierto y ráfagas del viento. */
export const FX_COLORS = ['#ff4d6d', '#ffd23f', '#3a86ff', '#06d6a0', '#ffffff'] as const;
export const GUST_COLORS = ['#ffffff', '#d7efff', '#b9e0ff'] as const;

/** Puesto según la proporción de preguntas acertadas a la primera. */
export const rankOf = (firstTry: number, total: number): 1 | 2 | 3 | 4 => {
  const ratio = total ? firstTry / total : 0;

  return ratio >= 0.9 ? 1 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 3 : 4;
};

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    stage: (altitude: number, total: number, bows: number) =>
      `Cielo con una cometa atada a un carrete. Altura: ${altitude} de ${total}. Lazos en la cola: ${bows}.`,
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    load: 'Seguir subiendo',
    retry: 'Reintentar',
    nextQuestion: 'Siguiente pregunta',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', spool: 'Carrete', height: 'Altura' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    okHint: '¡La cometa sube! Cada acierto la lleva más cerca de las nubes.',
    okBow: 'A la primera: ¡un lazo nuevo para la cola!',
    okSpool: 'Racha de tres: ganó un carrete de reserva.',
    koHint: 'Una ráfaga de viento baja la cometa. Esa respuesta queda descartada: inténtelo otra vez.',
    koSaved: 'El carrete de reserva dio cuerda a tiempo: la cometa no perdió altura.',
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    live: {
      question: (n: number) => `Pregunta ${n}.`,
      ok: (points: number, bow: boolean) =>
        `Correcta. Gana ${points} puntos y la cometa sube.${bow ? ' Un lazo nuevo en la cola.' : ''}`,
      okSpool: 'Ganó un carrete de reserva.',
      ko: 'Incorrecta. Una ráfaga baja la cometa y la respuesta queda descartada.',
      koSaved: 'Incorrecta, pero el carrete de reserva evitó que la cometa perdiera altura.'
    },
    summary: {
      title: '¡Se acabó el festival!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      falls: 'Ráfagas que la bajaron',
      saves: 'Caídas evitadas',
      rank: 'Puesto',
      again: 'Volar otra vez',
      ranks: {
        1: {
          title: '¡Cometa campeona!',
          text: 'Casi todas a la primera: su cometa llegó a las nubes con una cola enorme.'
        },
        2: { title: '¡Cometa de plata!', text: 'Vuelo firme: subió hasta lo más alto con poco viento en contra.' },
        3: {
          title: '¡Cometa de bronce!',
          text: 'Aguantó las ráfagas y llegó arriba. Con un repaso, la cola crecerá más.'
        },
        4: { title: '¡Cometa valiente!', text: 'El viento fue duro, pero no soltó el hilo y llegó a la cima.' }
      }
    },
    init: {
      title: 'Cometas de agosto',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Es agosto y hay viento: cada pregunta que acierte hace subir su cometa un poco más hacia las nubes.',
        'Si falla, una ráfaga baja la cometa y esa respuesta se descarta. Reintente la misma pregunta para recuperar la altura.',
        'Cada pregunta acertada a la primera añade un lazo de color a la cola.',
        'Cada tres aciertos seguidos gana un carrete de reserva: la próxima ráfaga no le hará perder altura.',
        'La partida termina cuando todas las preguntas están acertadas y la cometa llega a la cima.'
      ],
      back: 'Volver',
      start: '¡A volar!'
    }
  },
  en: {
    stage: (altitude: number, total: number, bows: number) =>
      `Sky with a kite tied to a spool. Height: ${altitude} of ${total}. Bows on the tail: ${bows}.`,
    question: 'Question',
    of: 'of',
    check: 'Check',
    load: 'Keep climbing',
    retry: 'Try again',
    nextQuestion: 'Next question',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', spool: 'Spool', height: 'Height' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    okHint: 'The kite climbs! Every right answer takes it closer to the clouds.',
    okBow: 'First try: a new bow for the tail!',
    okSpool: 'Streak of three: you won a spare spool.',
    koHint: 'A gust of wind pulls the kite down. That answer is ruled out: try again.',
    koSaved: 'The spare spool gave line in time: the kite did not lose height.',
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    live: {
      question: (n: number) => `Question ${n}.`,
      ok: (points: number, bow: boolean) =>
        `Correct. You win ${points} points and the kite climbs.${bow ? ' A new bow on the tail.' : ''}`,
      okSpool: 'You won a spare spool.',
      ko: 'Wrong. A gust pulls the kite down and that answer is ruled out.',
      koSaved: 'Wrong, but the spare spool kept the kite from losing height.'
    },
    summary: {
      title: 'Festival over!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      falls: 'Gusts that pulled it down',
      saves: 'Falls avoided',
      rank: 'Place',
      again: 'Fly again',
      ranks: {
        1: {
          title: 'Champion kite!',
          text: 'Almost all on the first try: your kite reached the clouds with a huge tail.'
        },
        2: { title: 'Silver kite!', text: 'Steady flight: it rose to the top with little headwind.' },
        3: {
          title: 'Bronze kite!',
          text: 'It held through the gusts and got up there. A little review and the tail will grow.'
        },
        4: { title: 'Brave kite!', text: 'The wind was tough, but you never let go of the string and reached the top.' }
      }
    },
    init: {
      title: 'August kites',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'It is August and the wind is up: every question you get right lifts your kite a little higher towards the clouds.',
        'If you miss, a gust pulls the kite down and that answer is ruled out. Retry the same question to regain the height.',
        'Every question answered on the first try adds a coloured bow to the tail.',
        'Every three correct answers in a row you win a spare spool: the next gust will not cost you height.',
        'The game ends when every question is answered correctly and the kite reaches the top.'
      ],
      back: 'Back',
      start: "Let's fly!"
    }
  }
};
