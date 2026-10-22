export const i18n = {
  es: {
    init: {
      title: 'Castillo del saber',
      play: 'Jugar',
      rulesTitle: '¿Cómo se juega?',
      rules: [
        'Lee la pregunta y elige el bloque con la respuesta correcta: el héroe corre hasta él.',
        'Pulsa «Comprobar» y el héroe golpea el bloque.',
        'Si aciertas, sale una moneda y se abre la puerta del castillo. Si fallas, el bloque se rompe y puedes reintentar.'
      ],
      back: 'Volver',
      start: '¡Al castillo!'
    }
  },
  en: {
    init: {
      title: 'Castle of knowledge',
      play: 'Play',
      rulesTitle: 'How to play',
      rules: [
        'Read the question and choose the block with the correct answer: the hero runs to it.',
        'Press “Check” and the hero hits the block.',
        'If you are right, a coin pops out and the castle gate opens. If you are wrong, the block breaks and you can try again.'
      ],
      back: 'Back',
      start: 'To the castle!'
    }
  }
};

/** Paleta del héroe de píxeles: una letra por color (el punto es transparente). */
const PALETTE: Record<string, string> = {
  r: '#d83a2a', // penacho
  h: '#c4ccd8', // casco
  H: '#7b8698', // casco (sombra)
  s: '#f2c08f', // piel
  e: '#1b1b1b', // ojos
  b: '#2e5fd1', // túnica
  B: '#1d3c91', // túnica (sombra)
  y: '#f5c542', // cinturón
  n: '#6b3b1d' // botas
};

/** Héroe original de 12×16 píxeles (un aprendiz de caballero), mirando a la derecha. */
const SPRITE = [
  '....rrrr....',
  '...rrrrrr...',
  '..hhhhhhhh..',
  '.hhhhhhhhhH.',
  '.hhssssssHH.',
  '.hhsessesHH.',
  '..hssssssH..',
  '..hhssssHH..',
  '...bbbbbb...',
  '..sbbyybbs..',
  '..sbbbbbbs..',
  '...bbyybb...',
  '...bbbbbb...',
  '...BB..BB...',
  '...nn..nn...',
  '..nnn..nnn..'
];

export const HERO_PIXELS = SPRITE.flatMap((row, y) =>
  [...row].flatMap((ch, x) => (PALETTE[ch] ? [{ x, y, fill: PALETTE[ch] }] : []))
);

export const HERO_COLS = SPRITE[0].length;
export const HERO_ROWS = SPRITE.length;

/** Colores de los fragmentos: monedas y estrellas al acertar, polvo al fallar. */
export const FX_COLORS = {
  gold: ['#ffd23f', '#fff1a8', '#f29e1d', '#ffffff'],
  dust: ['#b08a5a', '#8a6a42', '#d9c3a0', '#6b4a2a']
} as const;
export const CELEBRATION_MS = 2300; // Golpe al bloque, moneda, carrera hasta la puerta y puerta abierta
