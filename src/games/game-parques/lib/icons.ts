/** Iconos del juego (caja de 24 x 24). Son decorativos: el significado siempre va también en texto. */
export interface IconShape {
  d: string;
  /** `fill`: relleno con el color del texto; `stroke`: solo trazo; `both`: relleno y trazo. */
  mode: 'fill' | 'stroke' | 'both';
}

export const ICONS = {
  flame: [
    {
      d: 'M12 2c.8 3.6-2.8 5-2.8 9.2 0 1.4.6 2.6 1.6 3.3-.3-1.6.4-2.8 1.5-3.8.3 1.5 2.5 2.3 2.5 5A3.9 3.9 0 0 1 12 19.5a5.1 5.1 0 0 1-5-5.2C7 8.6 12 7 12 2Z',
      mode: 'fill'
    }
  ],
  star: [{ d: 'm12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1Z', mode: 'fill' }],
  check: [{ d: 'm4.5 12.5 5 5L19.5 7', mode: 'stroke' }],
  cross: [{ d: 'M6 6l12 12M18 6 6 18', mode: 'stroke' }],
  arrow: [{ d: 'M4 12h15M13 6l6 6-6 6', mode: 'stroke' }],
  flag: [
    { d: 'M6 22V3', mode: 'stroke' },
    { d: 'M6 4h12l-3 4.5 3 4.5H6', mode: 'both' }
  ],
  // Reglas y fichas
  lock: [
    { d: 'M5 11h14v10H5Z', mode: 'both' },
    { d: 'M8 11V8a4 4 0 0 1 8 0v3', mode: 'stroke' }
  ],
  target: [
    { d: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', mode: 'stroke' },
    { d: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', mode: 'stroke' },
    { d: 'M12 11.200a.8.8 0 1 0 0 1.600.8.8 0 0 0 0-1.600Z', mode: 'fill' }
  ],
  pair: [
    { d: 'M3 7h8v8H3Z', mode: 'stroke' },
    { d: 'M13 9h8v8h-8Z', mode: 'stroke' }
  ],
  dice: [
    { d: 'M4 4h16v16H4Z', mode: 'stroke' },
    { d: 'M8.500 8.500h.01M15.500 8.500h.01M12 12h.01M8.500 15.500h.01M15.500 15.500h.01', mode: 'stroke' }
  ],
  trophy: [
    { d: 'M7 4h10v5a5 5 0 0 1-10 0Z', mode: 'both' },
    { d: 'M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8', mode: 'stroke' }
  ],
  pawn: [{ d: 'M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM8 21c0-5 1.5-7.5 4-7.500s4 2.500 4 7.500Z', mode: 'fill' }]
} as const satisfies Record<string, readonly IconShape[]>;

export type IconName = keyof typeof ICONS;
