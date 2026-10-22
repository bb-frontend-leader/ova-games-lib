import { useEffect, useState } from 'react';

export type TimeOfDay = 'dawn' | 'day' | 'sunset' | 'night';

/** `auto` toma la hora local del dispositivo; las demás fijan la franja (útil para demos o pruebas). */
export type TimeOfDaySetting = 'auto' | TimeOfDay;

export interface SkyPalette {
  /** Degradado del cielo, de arriba hacia el horizonte */
  top: string;
  mid: string;
  bottom: string;
  /** Las dos capas de cada nube (luz y sombra) */
  cloudLight: string;
  cloudShade: string;
  /** Color y opacidad que se multiplican sobre toda la escena para dar el ambiente de la franja */
  tint: string;
  tintOpacity: number;
  /** Astro: el sol (día, amanecer y atardecer) o la luna (noche) */
  body: 'sun' | 'moon';
  bodyColor: string;
  bodyGlow: string;
  bodyX: number;
  bodyY: number;
  bodyR: number;
  stars: boolean;
  headlights: boolean;
}

export const DAWN_START = 5;
export const DAY_START = 8;
export const SUNSET_START = 17;
export const NIGHT_START = 19.5;

/**
 * Franja del día según la hora local: amanecer 5:00–8:00, día 8:00–17:00, atardecer 17:00–19:30 y noche el resto.
 */
export const getTimeOfDay = (date: Date = new Date()): TimeOfDay => {
  const hour = date.getHours() + date.getMinutes() / 60;

  if (hour >= DAWN_START && hour < DAY_START) return 'dawn';
  if (hour >= DAY_START && hour < SUNSET_START) return 'day';
  if (hour >= SUNSET_START && hour < NIGHT_START) return 'sunset';

  return 'night';
};

export const SKY: Record<TimeOfDay, SkyPalette> = {
  dawn: {
    top: '#8b9be0',
    mid: '#f6b0c0',
    bottom: '#ffdca4',
    cloudLight: '#ffe1d6',
    cloudShade: '#f7bcc4',
    tint: '#ffd0bd',
    tintOpacity: 0.16,
    body: 'sun',
    bodyColor: '#fff0b8',
    bodyGlow: '#ffd9a0',
    bodyX: 92,
    bodyY: 96,
    bodyR: 17,
    stars: false,
    headlights: false
  },
  day: {
    top: '#6cb5ee',
    mid: '#a9dbf7',
    bottom: '#e6f6fc',
    cloudLight: '#ffffff',
    cloudShade: '#d4ecf9',
    tint: '#ffffff',
    tintOpacity: 0,
    body: 'sun',
    bodyColor: '#fff3a6',
    bodyGlow: '#ffe98a',
    bodyX: 714,
    bodyY: 38,
    bodyR: 17,
    stars: false,
    headlights: false
  },
  sunset: {
    top: '#5d5bab',
    mid: '#ff8f62',
    bottom: '#ffd27c',
    cloudLight: '#ffb28c',
    cloudShade: '#e6826f',
    tint: '#ff9d6b',
    tintOpacity: 0.26,
    body: 'sun',
    bodyColor: '#ffe39a',
    bodyGlow: '#ff9b5e',
    bodyX: 706,
    bodyY: 90,
    bodyR: 22,
    stars: false,
    headlights: false
  },
  night: {
    top: '#0a0e2e',
    mid: '#1b2766',
    bottom: '#3a4a90',
    cloudLight: '#33407f',
    cloudShade: '#252f6a',
    tint: '#5663b8',
    tintOpacity: 0.5,
    body: 'moon',
    bodyColor: '#f3f1dc',
    bodyGlow: '#aebaf5',
    bodyX: 714,
    bodyY: 40,
    bodyR: 15,
    stars: true,
    headlights: true
  }
};

const MINUTE = 60_000;

/**
 * Franja actual del día. Con `auto` se vuelve a evaluar cada minuto, así el fondo cambia solo si la actividad
 * queda abierta durante el atardecer.
 */
export const useTimeOfDay = (setting: TimeOfDaySetting = 'auto'): TimeOfDay => {
  const [current, setCurrent] = useState<TimeOfDay>(() => getTimeOfDay());

  useEffect(() => {
    if (setting !== 'auto') return;

    setCurrent(getTimeOfDay());
    const timer = setInterval(() => setCurrent(getTimeOfDay()), MINUTE);

    return () => clearInterval(timer);
  }, [setting]);

  return setting === 'auto' ? current : setting;
};
