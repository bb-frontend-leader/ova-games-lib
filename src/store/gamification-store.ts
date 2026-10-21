import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { OVA_STORAGE_KEY } from '@/shared/utils/storage-key';

export type MedalTier = 'gold' | 'silver' | 'bronze' | 'none';

export interface ActivityRecord {
  stars: number /** Estrellas restantes (0 al máximo configurado). */;
  completed: boolean /** Si la actividad fue completada exitosamente. */;
  medalIndex: number /** Índice de la medalla ganada (0 = no ganada, 1+ = Nth medalla). */;
  maxStars: number /** Estrellas máximas configuradas para esta actividad. */;
  medalTier: MedalTier /** Nivel de medalla calculado al completar, según stars/maxStars. */;
  path?: string /** Página de la OVA donde vive la actividad (permite ubicar su medalla en la isla). Ausente en registros anteriores: se completa al volver a visitar la página. */;
  prev?: { stars: number; medalTier: MedalTier } /** Mejor resultado anterior mientras se reintenta la actividad (ver `retryActivity`): si el intento sale peor, se conserva. */;
}

/** Orden de los niveles: sirve para quedarse con el mejor resultado. */
export const MEDAL_TIER_RANK: Record<MedalTier, number> = { none: 0, bronze: 1, silver: 2, gold: 3 };

/** Calcula el nivel de medalla a partir de las estrellas finales y el máximo configurado. */
export const computeMedalTier = (stars: number, maxStars: number): MedalTier => {
  if (maxStars <= 0 || stars <= 0) return 'none';
  if (stars === maxStars) return 'gold';
  if (stars >= maxStars / 2) return 'silver';
  return 'bronze';
};

interface GamificationStore {
  activities: Record<string, ActivityRecord>;
  totalMedals: number /** Total de medallas ganadas a lo largo de todas las actividades. */;
  registerActivity: ( id: string, maxStars?: number, path?: string ) => void /** Registra una actividad por ID. No sobreescribe si ya existe (solo completa o actualiza su `path`). */;
  decrementStar: (id: string) => void /** Decrementa una estrella de la actividad (mínimo 0). No hace nada si ya está completada: su resultado queda guardado. */;
  completeActivity: (id: string ) => void /** Marca la actividad como completada y asigna el índice de medalla. Si venía de un reintento conserva el mejor resultado. Incrementa totalMedals solo al ganar la primera medalla. */;
  retryActivity: (id: string) => void /** Reabre una actividad completada para mejorar su medalla: estrellas al máximo y sin completar, recordando el resultado anterior. */;
  resetGamification: () => void /** Reinicia el store de gamificación por completo. */;
}

export const useGamificationStore = create<GamificationStore>()(
  devtools(
    persist(
      (set) => ({
        activities: {},
        totalMedals: 0,

        registerActivity: (id, maxStars = 3, path) =>
          set((state) => {
            const existing = state.activities[id];
            if (existing) {
              // Nunca se toca el progreso; solo se registra en qué página vive (registros anteriores a `path`).
              if (!path || existing.path === path) return state;
              return { activities: { ...state.activities, [id]: { ...existing, path } } };
            }
            return {
              activities: {
                ...state.activities,
                [id]: { stars: maxStars, completed: false, medalIndex: 0, maxStars, medalTier: 'none', path }
              }
            };
          }),

        decrementStar: (id) =>
          set((state) => {
            const activity = state.activities[id];
            // Completada = resultado guardado: repetirla (p. ej. tras reiniciar el progreso) no cuesta estrellas.
            if (!activity || activity.completed || activity.stars <= 0) return state;
            return {
              activities: {
                ...state.activities,
                [id]: { ...activity, stars: Math.max(0, activity.stars - 1) }
              }
            };
          }),

        completeActivity: (id) =>
          set((state) => {
            const activity = state.activities[id];
            if (!activity || activity.completed) return state;
            const { prev, ...current } = activity;
            const attemptTier = computeMedalTier(activity.stars, activity.maxStars ?? 3);
            // Reintento: si salió peor que el resultado anterior, se conserva el anterior.
            const keepPrev = prev !== undefined && MEDAL_TIER_RANK[prev.medalTier] > MEDAL_TIER_RANK[attemptTier];
            const medalTier = keepPrev ? prev.medalTier : attemptTier;
            const stars = keepPrev ? prev.stars : activity.stars;
            const hadMedal = (prev?.medalTier ?? 'none') !== 'none';
            const medalIndex =
              activity.medalIndex > 0
                ? activity.medalIndex
                : Object.values(state.activities).filter((a) => a.completed).length + 1;
            return {
              activities: {
                ...state.activities,
                [id]: { ...current, stars, completed: true, medalIndex, medalTier }
              },
              totalMedals: state.totalMedals + (!hadMedal && medalTier !== 'none' ? 1 : 0)
            };
          }),

        retryActivity: (id) =>
          set((state) => {
            const activity = state.activities[id];
            if (!activity || !activity.completed) return state;
            return {
              activities: {
                ...state.activities,
                [id]: {
                  ...activity,
                  stars: activity.maxStars ?? 3,
                  completed: false,
                  prev: { stars: activity.stars, medalTier: activity.medalTier ?? 'none' }
                }
              }
            };
          }),

        resetGamification: () => set({ activities: {}, totalMedals: 0 })
      }),
      {
        name: `${OVA_STORAGE_KEY}:gamification-session`,
        storage: createJSONStorage(() => localStorage)
      }
    ),
    { name: 'GamificationStore' }
  )
);
