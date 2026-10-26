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
  trophy: [
    { d: 'M7 4h10v5a5 5 0 0 1-10 0Z', mode: 'both' },
    { d: 'M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8', mode: 'stroke' }
  ],
  // Carrera
  bolt: [{ d: 'M13 2 4.500 13.500H11L10 22l9-12h-6.500Z', mode: 'fill' }],
  cone: [
    { d: 'M12 3 7 19h10Z', mode: 'both' },
    { d: 'M4 21h16M9 12h6', mode: 'stroke' }
  ],
  car: [
    { d: 'M3 15v-3l2.500-4.500h9L18 12l3 1.500V15Z', mode: 'both' },
    { d: 'M7.500 17.500a1.800 1.800 0 1 0 0 .01M16.500 17.500a1.800 1.800 0 1 0 0 .01', mode: 'stroke' }
  ]
} as const satisfies Record<string, readonly IconShape[]>;

export type IconName = keyof typeof ICONS;
