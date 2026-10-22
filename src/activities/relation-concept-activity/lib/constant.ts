// Textos en múltiples idiomas. Los de `status` se leen con lectores de pantalla (región en vivo y estado de cada tarjeta).
export const i18n = {
  es: {
    image: 'Imagen',
    selected: (name: string) => `«${name}» seleccionada. Elige su pareja.`,
    cancelled: 'Selección cancelada.',
    linked: (a: string, b: string, letter: string) => `«${a}» vinculada con «${b}», vínculo ${letter}.`,
    unlinked: (letter: string) => `Vínculo ${letter} deshecho.`,
    ready: 'Todas las tarjetas están vinculadas. Ya puedes pulsar Comprobar.',
    summary: (correct: number, total: number) => `${correct} de ${total} parejas correctas.`,
    retry: (remaining: number) => `Se conservaron las parejas correctas. Vincula las ${remaining} tarjetas restantes.`,
    status: {
      selected: 'seleccionada',
      link: (letter: string) => `vínculo ${letter}`,
      correct: 'correcta',
      incorrect: 'incorrecta',
      solved: 'pareja correcta resuelta'
    }
  },
  en: {
    image: 'Image',
    selected: (name: string) => `“${name}” selected. Choose its match.`,
    cancelled: 'Selection cancelled.',
    linked: (a: string, b: string, letter: string) => `“${a}” linked with “${b}”, link ${letter}.`,
    unlinked: (letter: string) => `Link ${letter} removed.`,
    ready: 'All cards are linked. You can now press Check.',
    summary: (correct: number, total: number) => `${correct} of ${total} pairs correct.`,
    retry: (remaining: number) => `Correct pairs were kept. Link the remaining ${remaining} cards.`,
    status: {
      selected: 'selected',
      link: (letter: string) => `link ${letter}`,
      correct: 'correct',
      incorrect: 'incorrect',
      solved: 'correct pair solved'
    }
  }
};
