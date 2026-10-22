// Textos en múltiples idiomas. La línea de estado es a la vez la región en vivo: lo que se ve es lo que se anuncia.
export const i18n = {
  es: {
    images: 'Imágenes',
    texts: 'Textos',
    imageSlot: 'Imagen elegida',
    textSlot: 'Texto elegido',
    emptyImage: 'Selecciona una imagen',
    emptyText: 'Selecciona el texto que le corresponde',
    progress: (matched: number, total: number) => `Parejas ${matched}/${total}`,
    idle: 'Elige una imagen y un texto que formen pareja.',
    imageSelected: (name: string) => `Imagen seleccionada: «${name}». Ahora elige su texto.`,
    textSelected: (text: string) => `Texto seleccionado: «${text}». Ahora elige su imagen.`,
    ready: 'Imagen y texto elegidos. Pulsa Comprobar.',
    right: (letter: string, matched: number, total: number) =>
      `¡Correcto! Pareja ${letter} resuelta (${matched} de ${total}).`,
    wrong: 'Incorrecto: esa imagen y ese texto no forman pareja. Cambia una de las dos elecciones.',
    complete: (total: number) => `¡Correcto! Resolviste las ${total} parejas. Pulsa Reiniciar para volver a jugar.`,
    status: {
      solved: (letter: string) => `pareja ${letter} resuelta`,
      wrong: 'incorrecta'
    }
  },
  en: {
    images: 'Images',
    texts: 'Texts',
    imageSlot: 'Chosen image',
    textSlot: 'Chosen text',
    emptyImage: 'Choose an image',
    emptyText: 'Choose the text that matches it',
    progress: (matched: number, total: number) => `Pairs ${matched}/${total}`,
    idle: 'Choose an image and a text that match.',
    imageSelected: (name: string) => `Image selected: “${name}”. Now choose its text.`,
    textSelected: (text: string) => `Text selected: “${text}”. Now choose its image.`,
    ready: 'Image and text chosen. Press Check.',
    right: (letter: string, matched: number, total: number) =>
      `Correct! Pair ${letter} solved (${matched} of ${total}).`,
    wrong: 'Incorrect: that image and that text do not match. Change one of your two choices.',
    complete: (total: number) => `Correct! You solved all ${total} pairs. Press Reset to play again.`,
    status: {
      solved: (letter: string) => `pair ${letter} solved`,
      wrong: 'incorrect'
    }
  }
};
