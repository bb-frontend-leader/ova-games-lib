/** Iconos del juego (caja de 24 x 24). Son decorativos: el significado siempre va también en texto. */
export interface IconShape {
  d: string;
  /** `fill`: relleno con el color del texto; `stroke`: solo trazo. */
  mode: 'fill' | 'stroke';
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
  drop: [{ d: 'M12 3c3.4 4.4 6 7.5 6 10.7a6 6 0 0 1-12 0C6 10.500 8.600 7.400 12 3Z', mode: 'fill' }],
  ship: [
    { d: 'M2.5 14.5h19L18.800 20H5.200Z', mode: 'fill' },
    { d: 'M7 14V9.500h10V14M12 9.500V4l3.500 1.500', mode: 'stroke' }
  ],
  target: [
    { d: 'M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z', mode: 'stroke' },
    { d: 'M12 2v5M12 17v5M2 12h5M17 12h5', mode: 'stroke' }
  ],
  radar: [
    { d: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', mode: 'stroke' },
    { d: 'M12 7.500a4.500 4.500 0 1 0 0 9 4.500 4.500 0 0 0 0-9Z', mode: 'stroke' },
    { d: 'M12 12 19 5', mode: 'stroke' }
  ]
} as const satisfies Record<string, readonly IconShape[]>;

export type IconName = keyof typeof ICONS;
