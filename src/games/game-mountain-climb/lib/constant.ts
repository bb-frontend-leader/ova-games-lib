const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// Textos del juego en varios idiomas
export const i18n = {
  es: {
    stage: (pos: number, total: number, meters: number) =>
      `Montaña: tramo ${pos} de ${total}, a ${meters} metros de altitud`,
    altitude: (meters: number) => `Altitud: ${meters} m`,
    nextStop: (steps: number, summit: boolean) =>
      `${summit ? 'Cumbre' : 'Campamento'} en ${plural(steps, 'tramo', 'tramos')}`,
    energyOf: (n: number, max: number) => `${n} de ${max}`,
    question: 'Pregunta',
    of: 'de',
    check: 'Comprobar',
    climb: 'Subir',
    retry: 'Reintentar',
    slide: 'Caer al campamento',
    rest: 'Descansar',
    next: 'Seguir subiendo',
    keepGoing: 'Volver a subir',
    results: 'Ver resultados',
    hud: { score: 'Puntos', streak: 'Racha', energy: 'Fuerzas', solved: 'Tramos' },
    answers: 'Respuestas',
    discarded: 'ya descartada',
    verdict: { ok: '¡Correcta!', ko: 'Incorrecta' },
    okHint: '¡Buen agarre! Subes un tramo.',
    okRested: 'Racha de tres: recuperas una de fuerzas.',
    koHint: 'Resbalas y pierdes una de fuerzas. Esa respuesta queda descartada: inténtalo otra vez.',
    koFall: (lost: number) =>
      lost > 0
        ? `Te quedas sin fuerzas: caerás ${plural(lost, 'tramo', 'tramos')} hasta el último campamento, y ${lost === 1 ? 'esa pregunta habrá que contestarla' : 'esas preguntas habrá que contestarlas'} otra vez.`
        : 'Te quedas sin fuerzas, pero ya estás en un campamento: descansarás y recuperarás todas las fuerzas.',
    camp: (n: number) => `¡Campamento ${n}!`,
    campText: 'Descansas, comes algo caliente y recuperas todas las fuerzas.',
    summit: '¡Cumbre!',
    summitText: '¡Llegaste a lo más alto! Vista despejada y bandera clavada.',
    fell: 'Sin fuerzas: ¡caes!',
    fellText: (lost: number, meters: number) =>
      `Resbalas ${plural(lost, 'tramo', 'tramos')} hasta el último campamento (${meters} m). ${lost === 1 ? 'Esa pregunta hay que volver a contestarla.' : 'Esas preguntas hay que volver a contestarlas.'}`,
    rested: 'Descansas en el campamento',
    restedText: 'No pierdes altura: recuperas todas las fuerzas y sigues.',
    bonus: (n: number) => `+${n} puntos de bonus`,
    live: {
      question: (n: number) => `Pregunta ${n}.`,
      ok: (points: number) => `Correcta. Ganas ${points} puntos y subes un tramo.`,
      okRested: 'Recuperas una de fuerzas.',
      ko: (energy: number, max: number) =>
        `Incorrecta. Resbalas y te quedan ${energy} de ${max} de fuerzas. La respuesta queda descartada.`,
      koFall: 'Incorrecta. Te quedas sin fuerzas.',
      climbing: 'Subiendo.',
      falling: 'Cayendo hasta el campamento.',
      camp: (n: number, bonus: number) => `Llegas al campamento ${n}. Recuperas las fuerzas y ganas ${bonus} puntos.`,
      summit: (bonus: number) => `¡Cumbre! Ganas ${bonus} puntos.`,
      fell: (lost: number) =>
        lost > 0
          ? `Caes ${plural(lost, 'tramo', 'tramos')} hasta el campamento. Hay que volver a contestar ${lost === 1 ? 'esa pregunta' : 'esas preguntas'}.`
          : 'Descansas en el campamento y recuperas las fuerzas.'
    },
    track: { label: 'Progreso de las preguntas', solved: 'acertada', pending: 'pendiente', review: 'por repasar' },
    summary: {
      title: '¡Cumbre conquistada!',
      score: 'Puntos',
      firstTry: 'A la primera',
      bestStreak: 'Mejor racha',
      attempts: 'Intentos',
      falls: 'Caídas',
      retraced: 'Tramos repetidos',
      again: 'Volver a subir'
    },
    init: {
      title: 'Escalada del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Vas a escalar una montaña: cada pregunta que aciertes te sube un tramo.',
        'Cada tres tramos hay un campamento. Al llegar descansas y recuperas todas las fuerzas, y ganas un bonus.',
        'Cada fallo te quita una de las tres fuerzas, y esa respuesta queda descartada para que lo intentes otra vez.',
        'Si te quedas sin fuerzas, caes hasta el último campamento y tendrás que volver a contestar las preguntas de los tramos perdidos.',
        'Cada tres aciertos seguidos recuperas una de fuerzas.',
        'La partida termina al llegar a la cumbre.'
      ],
      back: 'Volver',
      start: '¡A escalar!'
    }
  },
  en: {
    stage: (pos: number, total: number, meters: number) =>
      `Mountain: stage ${pos} of ${total}, at ${meters} metres of altitude`,
    altitude: (meters: number) => `Altitude: ${meters} m`,
    nextStop: (steps: number, summit: boolean) =>
      `${summit ? 'Summit' : 'Camp'} in ${plural(steps, 'stage', 'stages')}`,
    energyOf: (n: number, max: number) => `${n} of ${max}`,
    question: 'Question',
    of: 'of',
    check: 'Check',
    climb: 'Climb',
    retry: 'Try again',
    slide: 'Fall to camp',
    rest: 'Rest',
    next: 'Keep climbing',
    keepGoing: 'Climb again',
    results: 'See results',
    hud: { score: 'Score', streak: 'Streak', energy: 'Energy', solved: 'Stages' },
    answers: 'Answers',
    discarded: 'already ruled out',
    verdict: { ok: 'Correct!', ko: 'Wrong' },
    okHint: 'Good grip! You climb one stage.',
    okRested: 'Streak of three: you recover one energy.',
    koHint: 'You slip and lose one energy. That answer is ruled out: try again.',
    koFall: (lost: number) =>
      lost > 0
        ? `You run out of energy: you will fall ${plural(lost, 'stage', 'stages')} down to the last camp, and you will have to answer ${lost === 1 ? 'that question' : 'those questions'} again.`
        : 'You run out of energy, but you are already at a camp: you will rest and recover all your energy.',
    camp: (n: number) => `Camp ${n}!`,
    campText: 'You rest, eat something hot and recover all your energy.',
    summit: 'Summit!',
    summitText: 'You made it to the top! Clear view and flag planted.',
    fell: 'No energy left: you fall!',
    fellText: (lost: number, meters: number) =>
      `You slide ${plural(lost, 'stage', 'stages')} down to the last camp (${meters} m). You have to answer ${lost === 1 ? 'that question' : 'those questions'} again.`,
    rested: 'You rest at the camp',
    restedText: 'You do not lose height: you recover all your energy and carry on.',
    bonus: (n: number) => `+${n} bonus points`,
    live: {
      question: (n: number) => `Question ${n}.`,
      ok: (points: number) => `Correct. You win ${points} points and climb one stage.`,
      okRested: 'You recover one energy.',
      ko: (energy: number, max: number) =>
        `Wrong. You slip and have ${energy} of ${max} energy left. That answer is ruled out.`,
      koFall: 'Wrong. You run out of energy.',
      climbing: 'Climbing.',
      falling: 'Falling down to the camp.',
      camp: (n: number, bonus: number) => `You reach camp ${n}. You recover your energy and win ${bonus} points.`,
      summit: (bonus: number) => `Summit! You win ${bonus} points.`,
      fell: (lost: number) =>
        lost > 0
          ? `You fall ${plural(lost, 'stage', 'stages')} down to the camp. You have to answer ${lost === 1 ? 'that question' : 'those questions'} again.`
          : 'You rest at the camp and recover your energy.'
    },
    track: { label: 'Question progress', solved: 'correct', pending: 'pending', review: 'to review' },
    summary: {
      title: 'Summit conquered!',
      score: 'Score',
      firstTry: 'First try',
      bestStreak: 'Best streak',
      attempts: 'Attempts',
      falls: 'Falls',
      retraced: 'Repeated stages',
      again: 'Climb again'
    },
    init: {
      title: 'The climb of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'You will climb a mountain: every question you get right takes you up one stage.',
        'Every three stages there is a camp. When you arrive you rest and recover all your energy, and win a bonus.',
        'Every mistake costs one of your three energy points, and that answer is ruled out so you can try again.',
        'If you run out of energy, you fall to the last camp and will have to answer the questions of the lost stages again.',
        'Every three correct answers in a row you recover one energy.',
        'The game ends when you reach the summit.'
      ],
      back: 'Back',
      start: "Let's climb!"
    }
  }
};

/** Puntos del juego. */
export const SCORE = {
  /** Por acertar a la primera y al reintentar (o al repetir una pregunta tras una caída). */
  answer: 10,
  retry: 5,
  /** Extra por racha: cada acierto seguido suma `streakStep` hasta `streakCap` veces. */
  streakStep: 2,
  streakCap: 4,
  /** Bonus por llegar a un campamento y a la cumbre. */
  camp: 15,
  summit: 50
} as const;

/** Fuerzas con las que se empieza (y a las que se vuelve en cada campamento). */
export const ENERGY_MAX = 3;

/** Cada cuántos tramos hay un campamento y cada cuántos aciertos seguidos se recupera una de fuerzas. */
export const CAMP_EVERY = 3;
export const STREAK_ENERGY = 3;

/** Metros de altitud que sube cada tramo. */
export const ALT_STEP = 250;

/** Montaña de la pantalla de inicio: tramos y tramo en el que está el escalador. */
export const INIT_TOTAL = 8;
export const INIT_POS = 4;

/** Confeti del acierto, nieve que levanta una caída y destellos de la cumbre. */
export const FX_COLORS = ['#ffb347', '#ffffff', '#7fd1ff', '#ff6b6b', '#ffe066'] as const;
export const SNOW_COLORS = ['#ffffff', '#e6f4ff', '#cfe8fb'] as const;
export const SUMMIT_COLORS = ['#fff3b0', '#ffc933', '#ffffff', '#ff8a3d', '#7fd1ff'] as const;
