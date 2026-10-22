// Textos del juego en varios idiomas
export const i18n = {
  es: {
    question: 'Pregunta',
    blank: 'espacio en blanco',
    hint: 'Pista',
    hideHint: 'Ocultar pista',
    stamp: { ok: '¡Correcta!', ko: 'Incorrecta' },
    status: { ok: '¡Correcto!', ko: '¡Incorrecto!' },
    sentence: 'Enunciado completo'
  },
  en: {
    question: 'Question',
    blank: 'blank space',
    hint: 'Hint',
    hideHint: 'Hide hint',
    stamp: { ok: 'Correct!', ko: 'Wrong' },
    status: { ok: 'Correct!', ko: 'Incorrect!' },
    sentence: 'Full statement'
  }
};

// Colores del confeti del acierto
export const FX_COLORS = ['#ffd23f', '#ff7a90', '#5cc8ff', '#7be07b', '#ffffff'] as const;
