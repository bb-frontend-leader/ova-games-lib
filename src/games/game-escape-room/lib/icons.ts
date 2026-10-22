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
  lock: [
    { d: 'M6 11h12v9H6Z', mode: 'fill' },
    { d: 'M8.5 11V8a3.5 3.5 0 0 1 7 0v3', mode: 'stroke' }
  ],
  unlock: [
    { d: 'M6 11h12v9H6Z', mode: 'fill' },
    { d: 'M8.5 11V8a3.5 3.5 0 0 1 6.5-1.8', mode: 'stroke' }
  ],
  door: [
    { d: 'M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16', mode: 'stroke' },
    { d: 'M15 12h.01', mode: 'stroke' }
  ],
  note: [
    { d: 'M6 3h9l4 4v14H6Z', mode: 'stroke' },
    { d: 'M9 12h7M9 16h7', mode: 'stroke' }
  ],
  book: [
    { d: 'M5 5a2 2 0 0 1 2-2h11v15H7a2 2 0 0 0-2 2ZM5 20a2 2 0 0 0 2 1h11', mode: 'stroke' },
    { d: 'M9 7h6', mode: 'stroke' }
  ],
  clock: [
    { d: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', mode: 'stroke' },
    { d: 'M12 7v5l3 2', mode: 'stroke' }
  ],
  chest: [
    { d: 'M4 10a8 8 0 0 1 16 0v9H4ZM4 12h16', mode: 'stroke' },
    { d: 'M11 12v3h2v-3', mode: 'stroke' }
  ],
  frame: [
    { d: 'M4 4h16v16H4Z', mode: 'stroke' },
    { d: 'M4 16l5-5 4 4 3-3 4 4M15 8.5h.01', mode: 'stroke' }
  ],
  flask: [
    { d: 'M9 3h6M10 3v6l-5 10a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2l-5-10V3', mode: 'stroke' },
    { d: 'M7.5 15h9', mode: 'stroke' }
  ],
  lamp: [
    { d: 'M9 18h6M10 21h4', mode: 'stroke' },
    { d: 'M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .9 1.6h5.2c.1-.6.4-1.2.9-1.6A6 6 0 0 0 12 3Z', mode: 'stroke' }
  ],
  globe: [
    { d: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', mode: 'stroke' },
    { d: 'M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18', mode: 'stroke' }
  ],
  drawer: [
    { d: 'M4 5h16v14H4ZM4 12h16', mode: 'stroke' },
    { d: 'M10 8.5h4M10 15.5h4', mode: 'stroke' }
  ],
  key: [
    { d: 'M7.5 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z', mode: 'stroke' },
    { d: 'M11 12h10M18 12v3', mode: 'stroke' }
  ]
} as const satisfies Record<string, readonly IconShape[]>;

export type IconName = keyof typeof ICONS;

/** Los objetos que se pueden esconder en una sala. */
export type ObjectIcon = 'book' | 'clock' | 'chest' | 'frame' | 'flask' | 'lamp' | 'globe' | 'drawer' | 'key';
