import { PAY, SYMBOL_WEIGHTS, SYMBOLS, TIER_ORDER, TIER_WEIGHTS } from './constant';

import type { SlotsSymbol, Tier } from '../types/types';

type Random = () => number;

export interface Roll {
  middle: SlotsSymbol[];
  tier: Tier;
  symbol: SlotsSymbol | null;
  base: number;
}

const pick = <T>(items: readonly T[], weights: readonly number[], random: Random): T => {
  let left = random() * weights.reduce((sum, weight) => sum + weight, 0);

  for (let i = 0; i < items.length; i++) {
    left -= weights[i];

    if (left < 0) return items[i];
  }

  return items[items.length - 1];
};

const randomSymbol = (random: Random) => SYMBOLS[Math.floor(random() * SYMBOLS.length)];

/**
 * Decide la línea central de una tirada: primero cómo sale (nada, pareja o trío) y luego con qué símbolos.
 * Se decide de entrada y los carretes solo lo muestran, así el premio no depende del rendimiento del equipo.
 */
export const rollSpin = (random: Random = Math.random): Roll => {
  const tier = pick(TIER_ORDER, TIER_WEIGHTS, random);

  if (tier === 'triple') {
    const symbol = pick(SYMBOLS, SYMBOL_WEIGHTS, random);

    return {
      middle: [symbol, symbol, symbol],
      tier: symbol === 'diamond' ? 'jackpot' : 'triple',
      symbol,
      base: PAY[symbol].triple
    };
  }

  if (tier === 'pair') {
    const symbol = pick(SYMBOLS, SYMBOL_WEIGHTS, random);
    const others = SYMBOLS.filter((item) => item !== symbol);
    const odd = others[Math.floor(random() * others.length)];
    const middle = [symbol, symbol, symbol];

    middle[Math.floor(random() * middle.length)] = odd;

    return { middle, tier: 'pair', symbol, base: PAY[symbol].pair };
  }

  // Sin premio: tres símbolos distintos
  const pool = [...SYMBOLS];
  const middle: SlotsSymbol[] = [];

  for (let i = 0; i < 3; i++) middle.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);

  return { middle, tier: 'none', symbol: null, base: 0 };
};

/**
 * Tira de un carrete: lo que se veía antes, símbolos de relleno que pasan girando, la columna final (con el
 * resultado en el centro) y un símbolo más debajo por si el freno se pasa un poco.
 */
export const buildStrip = (
  seen: readonly SlotsSymbol[],
  result: SlotsSymbol,
  filler: number,
  random: Random = Math.random
) => [
  ...seen,
  ...Array.from({ length: filler }, () => randomSymbol(random)),
  randomSymbol(random),
  result,
  randomSymbol(random),
  randomSymbol(random)
];

/** Los tres símbolos visibles de una tira (de arriba abajo). */
export const visible = (strip: readonly SlotsSymbol[]) => strip.slice(strip.length - 4, strip.length - 1);

/** Desplazamiento (en % de la altura de la tira) que deja a la vista los tres símbolos finales. */
export const finalOffset = (length: number) => -((length - 4) / length) * 100;
