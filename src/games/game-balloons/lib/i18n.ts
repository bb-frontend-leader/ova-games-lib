// Textos del juego en múltiples idiomas (etiquetas accesibles y rótulos del tablero)
export const i18n = {
  es: {
    balloons: 'Globos con palabras',
    slots: 'Frase por armar',
    sentenceTag: 'Frase',
    correct: 'Frase correcta',
    wrong: 'Frase incorrecta',
    wrongHint: 'Frase incorrecta. Puede reintentar.',
    assembled: (text: string) => `Frase armada: ${text || 'vacía'}`,
    slotEmpty: (n: number) => `Espacio ${n}, vacío`,
    slotFilled: (n: number, text: string) => `Espacio ${n}, contiene ${text}`,
    remove: (n: number, text: string) => `Eliminar ${text} del espacio ${n}`
  },
  en: {
    balloons: 'Balloons with words',
    slots: 'Sentence to build',
    sentenceTag: 'Sentence',
    correct: 'Correct sentence',
    wrong: 'Incorrect sentence',
    wrongHint: 'Incorrect sentence. You can try again.',
    assembled: (text: string) => `Sentence built: ${text || 'empty'}`,
    slotEmpty: (n: number) => `Slot ${n}, empty`,
    slotFilled: (n: number, text: string) => `Slot ${n}, contains ${text}`,
    remove: (n: number, text: string) => `Remove ${text} from slot ${n}`
  }
};
