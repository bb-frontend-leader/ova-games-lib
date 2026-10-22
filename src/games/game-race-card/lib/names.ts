// Apodos de piloto para el botón «Nombre al azar». Ninguno pasa de 12 letras, el máximo del campo.
export const RANDOM_NAMES = {
  es: [
    'Rayo',
    'Turbo',
    'Cometa',
    'Fénix',
    'Trueno',
    'Halcón',
    'Bólido',
    'Centella',
    'Relámpago',
    'Meteoro',
    'Gacela',
    'Pantera',
    'Jaguar',
    'Delfín',
    'Tormenta',
    'Saeta',
    'Torbellino',
    'Águila',
    'Ráfaga',
    'Rayo Azul',
    'Turbo Max',
    'Piloto Zeta',
    'Lobo Veloz',
    'Zorro Rápido',
    'Nitro',
    'Chispa',
    'Cóndor',
    'Tigre'
  ],
  en: [
    'Lightning',
    'Turbo',
    'Comet',
    'Phoenix',
    'Thunder',
    'Falcon',
    'Rocket',
    'Blaze',
    'Cheetah',
    'Panther',
    'Jaguar',
    'Storm',
    'Dash',
    'Bolt',
    'Nitro',
    'Ace',
    'Zippy',
    'Rally',
    'Drift',
    'Gale',
    'Turbo Max',
    'Blue Streak',
    'Swift Wolf',
    'Quick Fox',
    'Spark',
    'Condor',
    'Tiger',
    'Meteor'
  ]
} as const;

/**
 * Un apodo al azar en el idioma indicado, distinto del que ya está escrito para que el botón siempre cambie algo.
 */
export const pickRandomName = (lang: keyof typeof RANDOM_NAMES, current: string): string => {
  const names = RANDOM_NAMES[lang].filter((name) => name.toLowerCase() !== current.trim().toLowerCase());

  return names[Math.floor(Math.random() * names.length)];
};
