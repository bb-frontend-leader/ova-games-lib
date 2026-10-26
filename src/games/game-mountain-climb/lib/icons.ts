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
  bolt: [{ d: 'M13.500 2 5 13.500h6L10 22l9-12h-6Z', mode: 'fill' }],
  mountain: [{ d: 'M2 20 9 7l4 6 2.500-4L22 20Z', mode: 'fill' }],
  flag: [
    { d: 'M6 22V3', mode: 'stroke' },
    { d: 'M6 4h12l-3 4.500 3 4.500H6', mode: 'both' }
  ],
  tent: [{ d: 'M12 3 2.500 20h19Z', mode: 'fill' }],
  arrow: [{ d: 'M4 12h15M13 6l6 6-6 6', mode: 'stroke' }]
} as const satisfies Record<string, readonly IconShape[]>;

export type IconName = keyof typeof ICONS;
