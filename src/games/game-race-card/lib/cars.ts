import type { CSSProperties } from 'react';

export type CarId = 'emerald' | 'ruby' | 'solar' | 'violet' | 'coral';

export interface CarSkin {
  id: CarId;
  /** Carrocería, cuña delantera, pontón, rayos, línea del alerón y casco */
  main: string;
  light: string;
  side: string;
  decal: string;
  wing: string;
  helmet: string;
  /** Color que representa al auto en el selector */
  swatch: string;
}

// El auto rival es azul, por eso ninguna skin lo es
export const CAR_SKINS: CarSkin[] = [
  {
    id: 'emerald',
    main: '#4da623',
    light: '#76e0b3',
    side: '#23ba76',
    decal: '#257100',
    wing: '#247000',
    helmet: '#fab83a',
    swatch: '#3fa05c'
  },
  {
    id: 'ruby',
    main: '#d6283a',
    light: '#ff8a8f',
    side: '#b81c36',
    decal: '#7d0f26',
    wing: '#7d0f26',
    helmet: '#f5f5f0',
    swatch: '#d6283a'
  },
  {
    id: 'solar',
    main: '#f2a516',
    light: '#ffe08a',
    side: '#e2780d',
    decal: '#a04b05',
    wing: '#a04b05',
    helmet: '#2a2f55',
    swatch: '#f2a516'
  },
  {
    id: 'violet',
    main: '#8a45d6',
    light: '#d3a8ff',
    side: '#6b2fb8',
    decal: '#44157f',
    wing: '#44157f',
    helmet: '#7de3d5',
    swatch: '#8a45d6'
  },
  {
    id: 'coral',
    main: '#ef5f86',
    light: '#ffb1c6',
    side: '#d03f73',
    decal: '#8f1f4b',
    wing: '#8f1f4b',
    helmet: '#ffd24a',
    swatch: '#ef5f86'
  }
];

export const DEFAULT_CAR: CarId = 'emerald';

export const getSkin = (id: CarId): CarSkin => CAR_SKINS.find((skin) => skin.id === id) ?? CAR_SKINS[0];

/** Variables CSS que repintan al auto del jugador (ver `race-svg.module.css`) */
export const skinVars = (id: CarId): CSSProperties => {
  const skin = getSkin(id);

  return {
    '--car-main': skin.main,
    '--car-light': skin.light,
    '--car-side': skin.side,
    '--car-decal': skin.decal,
    '--car-wing': skin.wing,
    '--helmet': skin.helmet
  } as CSSProperties;
};
