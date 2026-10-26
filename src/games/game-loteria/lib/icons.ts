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
  trophy: [
    { d: 'M7 4h10v5a5 5 0 0 1-10 0Z', mode: 'both' },
    { d: 'M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8', mode: 'stroke' }
  ],
  // Lotería
  grid: [{ d: 'M4 4h6v6H4ZM14 4h6v6h-6ZM4 14h6v6H4ZM14 14h6v6h-6Z', mode: 'both' }],
  cards: [
    { d: 'M7 4h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z', mode: 'both' },
    { d: 'M9.500 9h5M9.500 13h3', mode: 'stroke' }
  ],
  bean: [
    { d: 'M12 4c4.500 0 8 3.600 8 8s-3.500 8-8 8c-3.500 0-6.500-2-6.500-5.500C5.500 11.500 7 4 12 4Z', mode: 'fill' }
  ],
  bulb: [
    {
      d: 'M12 3a6 6 0 0 0-3.500 10.900c.700.600 1 1.300 1 2.100h5c0-.800.300-1.500 1-2.100A6 6 0 0 0 12 3Z',
      mode: 'both'
    },
    { d: 'M9.500 18.500h5M10.500 21h3', mode: 'stroke' }
  ]
} as const satisfies Record<string, readonly IconShape[]>;

export type IconName = keyof typeof ICONS;
