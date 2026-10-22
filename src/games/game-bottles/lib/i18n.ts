// Textos del juego en múltiples idiomas (etiquetas accesibles y rótulos de la bandeja)
export const i18n = {
  es: {
    bottles: 'Botellas con letras',
    bottle: (letter: string) => `Letra ${letter}`,
    slots: 'Palabra por armar',
    wordTag: 'Palabra',
    correct: 'Palabra correcta',
    wrongHint: 'Palabra incorrecta. Puede reintentar.',
    assembled: (text: string) => `Palabra armada: ${text || 'vacía'}`,
    slotEmpty: (n: number) => `Espacio ${n}, vacío`,
    slotFilled: (n: number, text: string) => `Espacio ${n}, contiene ${text}`,
    remove: (n: number, text: string) => `Eliminar ${text} del espacio ${n}`
  },
  en: {
    bottles: 'Bottles with letters',
    bottle: (letter: string) => `Letter ${letter}`,
    slots: 'Word to build',
    wordTag: 'Word',
    correct: 'Correct word',
    wrongHint: 'Incorrect word. You can try again.',
    assembled: (text: string) => `Word built: ${text || 'empty'}`,
    slotEmpty: (n: number) => `Slot ${n}, empty`,
    slotFilled: (n: number, text: string) => `Slot ${n}, contains ${text}`,
    remove: (n: number, text: string) => `Remove ${text} from slot ${n}`
  }
};
