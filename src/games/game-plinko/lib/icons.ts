/** Iconos del juego (caja de 24 x 24). Son decorativos: el significado siempre va también en texto. */
export const ICON_PATHS = {
  flame:
    'M12 2c.8 3.6-2.8 5-2.8 9.2 0 1.4.6 2.6 1.6 3.3-.3-1.6.4-2.8 1.5-3.8.3 1.5 2.5 2.3 2.5 5A3.9 3.9 0 0 1 12 19.5a5.1 5.1 0 0 1-5-5.2C7 8.6 12 7 12 2Z',
  star: 'm12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1Z',
  ball: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z',
  check: 'm4.5 12.5 5 5L19.5 7',
  cross: 'M6 6l12 12M18 6 6 18'
} as const;

export type IconName = keyof typeof ICON_PATHS;
