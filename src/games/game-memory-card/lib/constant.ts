export const i18n = {
  es: {
    pairs: 'Parejas',
    tries: 'Intentos',
    allFound: '¡Todas las parejas!',
    card: (n: number, total: number) => `Carta ${n} de ${total}`,
    faceDown: 'boca abajo, pulsa para voltearla',
    faceUp: 'descubierta',
    matched: 'pareja encontrada',
    board: 'Tablero de cartas',
    flipMsg: (text: string) => `Descubriste: ${text}. Busca su pareja.`,
    matchMsg: (a: string, b: string) => `¡Pareja encontrada! ${a} y ${b}.`,
    missMsg: (a: string, b: string) => `${a} y ${b} no son pareja. Vuelven boca abajo.`,
    doneMsg: '¡Encontraste todas las parejas! Ya puedes comprobar.',
    resetMsg: 'Juego reiniciado. Todas las cartas están boca abajo.'
  },
  en: {
    pairs: 'Pairs',
    tries: 'Tries',
    allFound: 'All pairs found!',
    card: (n: number, total: number) => `Card ${n} of ${total}`,
    faceDown: 'face down, press to flip it',
    faceUp: 'face up',
    matched: 'pair found',
    board: 'Card board',
    flipMsg: (text: string) => `You flipped: ${text}. Find its pair.`,
    matchMsg: (a: string, b: string) => `Pair found! ${a} and ${b}.`,
    missMsg: (a: string, b: string) => `${a} and ${b} are not a pair. They turn face down.`,
    doneMsg: 'You found all the pairs! You can check now.',
    resetMsg: 'Game restarted. All cards are face down.'
  }
};
