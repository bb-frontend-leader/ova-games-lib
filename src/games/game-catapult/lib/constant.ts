const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    stage: (distance: number, downed: number) =>
      `Campo de batalla: la catapulta apunta a una torre enemiga a ${distance} metros. Torres derribadas: ${downed}.`,
    tower: (distance: number) => `Torre enemiga a ${distance} m`,
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    load: 'Cargar la catapulta',
    retry: 'Reintentar',
    fire: 'Disparar',
    nextQuestion: 'Siguiente pregunta',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', fire: 'Fuego', towers: 'Torres' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    okHint: '¡Ganaste una piedra! Carga la catapulta y apunta a la torre enemiga.',
    koHint: 'Esa respuesta queda descartada. Sin respuesta correcta no hay piedra: inténtalo otra vez.',
    okFire: 'Racha de tres: ganaste una bola de fuego.',
    aim: {
      title: '¡Apunta y dispara!',
      text: 'Elige el ángulo y la fuerza. La línea de puntos te enseña el comienzo del vuelo; el resto lo decide la física.',
      angle: 'Ángulo',
      power: 'Fuerza',
      angleValue: (n: number) => `${n} grados`,
      powerValue: (n: number) => `${n} por ciento`,
      fireball: 'Bola de fuego',
      fireballHint: 'Explota al caer: la torre se derriba aunque te quedes un poco corto o largo.',
      fireballOn: 'Bola de fuego activada.',
      last: (text: string) => `Último disparo: ${text}`
    },
    result: {
      direct: '¡Impacto directo!',
      hit: '¡Torre derribada!',
      short: (m: number) => `Te quedaste corto por ${m} m`,
      long: (m: number) => `Te pasaste por ${m} m`,
      shortHint: 'Más fuerza, o un ángulo más cercano a 45 grados, para llegar más lejos.',
      longHint: 'Menos fuerza, o un ángulo más alejado de 45 grados, para que no llegue tan lejos.',
      hitHint: (m: number) => `La piedra cayó a ${m} m de la torre.`,
      combo: (n: number) => `Torres derribadas seguidas: ${n}.`,
      points: (n: number) => `+${n} puntos`
    },
    live: {
      question: (n: number) => `Pregunta ${n}.`,
      ok: (points: number) => `Correcta. Ganas ${points} puntos y una piedra.`,
      okFire: 'Ganaste una bola de fuego.',
      ko: 'Incorrecta. La respuesta queda descartada.',
      aim: (distance: number) => `Apunta a la torre enemiga, que está a ${distance} metros.`,
      firing: 'Disparando.',
      direct: (points: number) => `¡Impacto directo! Ganas ${points} puntos.`,
      hit: (points: number) => `¡Torre derribada! Ganas ${points} puntos.`,
      short: (m: number) => `Te quedaste corto por ${m} metros.`,
      long: (m: number) => `Te pasaste por ${m} metros.`,
      mode: (on: boolean) => (on ? 'Bola de fuego activada.' : 'Bola de fuego desactivada.')
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      title: '¡Asedio terminado!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      hits: 'Torres derribadas',
      directs: 'Impactos directos',
      bestCombo: 'Mejor racha de torres',
      accuracy: 'Puntería',
      again: 'Jugar de nuevo'
    },
    init: {
      title: 'La catapulta del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Vas a asediar un castillo: cada pregunta que aciertes te da una piedra para la catapulta.',
        'Si fallas, esa respuesta se descarta y puedes intentarlo de nuevo. Sin acierto no hay piedra.',
        'Con la piedra, elige el ángulo y la fuerza del disparo y apunta a la torre enemiga, que cada vez está a una distancia distinta.',
        'Si fallas el disparo, te diremos cuánto te quedaste corto o te pasaste. Ajusta y vuelve a intentarlo con la siguiente piedra.',
        'Un impacto directo en el centro de la torre da bonus, y encadenar torres derribadas suma más.',
        'Cada tres aciertos seguidos ganas una bola de fuego: derriba la torre aunque no des justo.',
        'La partida termina al acertar todas las preguntas y lanzar la última piedra.'
      ],
      back: 'Volver',
      start: '¡A disparar!'
    }
  },
  en: {
    stage: (distance: number, downed: number) =>
      `Battlefield: the catapult aims at an enemy tower ${distance} metres away. Towers downed: ${downed}.`,
    tower: (distance: number) => `Enemy tower at ${distance} m`,
    question: 'Question',
    of: 'of',
    check: 'Check',
    load: 'Load the catapult',
    retry: 'Try again',
    fire: 'Fire',
    nextQuestion: 'Next question',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', fire: 'Fire', towers: 'Towers' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    okHint: 'You won a stone! Load the catapult and aim at the enemy tower.',
    koHint: 'That answer is ruled out. No correct answer, no stone: try again.',
    okFire: 'Streak of three: you won a fireball.',
    aim: {
      title: 'Aim and fire!',
      text: 'Choose the angle and the power. The dotted line shows the start of the flight; physics decides the rest.',
      angle: 'Angle',
      power: 'Power',
      angleValue: (n: number) => `${n} degrees`,
      powerValue: (n: number) => `${n} percent`,
      fireball: 'Fireball',
      fireballHint: 'It explodes on landing: the tower falls even if you are a little short or long.',
      fireballOn: 'Fireball on.',
      last: (text: string) => `Last shot: ${text}`
    },
    result: {
      direct: 'Direct hit!',
      hit: 'Tower down!',
      short: (m: number) => `You fell short by ${m} m`,
      long: (m: number) => `You overshot by ${m} m`,
      shortHint: 'More power, or an angle closer to 45 degrees, to reach further.',
      longHint: 'Less power, or an angle further from 45 degrees, so it does not go as far.',
      hitHint: (m: number) => `The stone landed ${m} m from the tower.`,
      combo: (n: number) => `Towers downed in a row: ${n}.`,
      points: (n: number) => `+${n} points`
    },
    live: {
      question: (n: number) => `Question ${n}.`,
      ok: (points: number) => `Correct. You win ${points} points and a stone.`,
      okFire: 'You won a fireball.',
      ko: 'Wrong. That answer is ruled out.',
      aim: (distance: number) => `Aim at the enemy tower, ${distance} metres away.`,
      firing: 'Firing.',
      direct: (points: number) => `Direct hit! You win ${points} points.`,
      hit: (points: number) => `Tower down! You win ${points} points.`,
      short: (m: number) => `You fell short by ${plural(m, 'metre', 'metres')}.`,
      long: (m: number) => `You overshot by ${plural(m, 'metre', 'metres')}.`,
      mode: (on: boolean) => (on ? 'Fireball on.' : 'Fireball off.')
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      title: 'Siege complete!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      hits: 'Towers downed',
      directs: 'Direct hits',
      bestCombo: 'Best tower streak',
      accuracy: 'Accuracy',
      again: 'Play again'
    },
    init: {
      title: 'The catapult of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'You will besiege a castle: every question you get right gives you a stone for the catapult.',
        'If you miss, that answer is ruled out and you can try again. No correct answer, no stone.',
        'With the stone, choose the angle and the power of the shot and aim at the enemy tower, which is a different distance away each time.',
        'If you miss the shot, we will tell you how short or how long you were. Adjust and try again with the next stone.',
        'A direct hit on the centre of the tower gives a bonus, and chaining downed towers earns more.',
        'Every three correct answers in a row you win a fireball: it brings the tower down even if you are not exact.',
        'The game ends when you answer every question correctly and fire the last stone.'
      ],
      back: 'Back',
      start: "Let's fire!"
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
  /** Por derribar una torre, extra por impacto directo y por cada torre seguida (hasta `comboCap`). */
  hit: 20,
  direct: 15,
  combo: 5,
  comboCap: 5
} as const;

/** Bolas de fuego que se pueden tener a la vez y cada cuántos aciertos seguidos se gana una. */
export const MAX_FIRE = 2;
export const STREAK_FIRE = 3;

/** Ángulo (grados) y fuerza (%) del disparo: mínimos, máximos y valores de partida. */
export const ANGLE = { min: 15, max: 75, start: 45 } as const;
export const POWER = { min: 20, max: 100, start: 60 } as const;

/** Distancias (m) a las que puede aparecer la torre enemiga. */
export const TARGETS = [26, 34, 42, 50, 58, 66, 74] as const;

/** Margen (m) del alcance respecto a la torre: derribarla, impacto directo y la ayuda de la bola de fuego. */
export const TOLERANCE = { hit: 4, direct: 1.5, fire: 3 } as const;

/** Pantalla de inicio: torre a mitad de camino y sin disparos previos. */
export const INIT_TARGET = 50;

/** Confeti del acierto, escombros de la torre y chispas de la bola de fuego. */
export const FX_COLORS = ['#ffc233', '#ffffff', '#ff7a59', '#7fe3c8', '#c9a7ff'] as const;
export const DEBRIS_COLORS = ['#cdbb98', '#a89573', '#e6d9bd', '#8b7a5c'] as const;
export const FIRE_COLORS = ['#ff7a1a', '#ffc233', '#fff3b0', '#ff4d2e'] as const;
