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
  target: [
    { d: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', mode: 'stroke' },
    { d: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', mode: 'stroke' },
    { d: 'M12 11.200a.8.8 0 1 0 0 1.600.8.8 0 0 0 0-1.600Z', mode: 'fill' }
  ],
  bocin: [
    { d: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z', mode: 'stroke' },
    { d: 'M12 2l2 3h-4ZM12 22l-2-3h4ZM2 12l3-2v4ZM22 12l-3 2v-4Z', mode: 'fill' }
  ],
  disc: [{ d: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z', mode: 'fill' }],
  boom: [{ d: 'm12 2 2 5 5-2-2 5 5 2-5 2 2 5-5-2-2 5-2-5-5 2 2-5-5-2 5-2-2-5 5 2Z', mode: 'fill' }],
  arrow: [{ d: 'M4 12h15M13 6l6 6-6 6', mode: 'stroke' }]
} as const satisfies Record<string, readonly IconShape[]>;

export type IconName = keyof typeof ICONS;
